import {
  CastAddMessage,
  CastRemoveMessage,
  getInsecureHubRpcClient,
  getSSLHubRpcClient,
  HubRpcClient,
  isCastAddMessage,
  isCastRemoveMessage,
  isMergeMessageHubEvent,
  Message,
} from "@farcaster/hub-nodejs";
import type { queueAsPromised } from "fastq";
import * as fastq from "fastq";
import humanizeDuration from "humanize-duration";
import os from "node:os";
import { Logger } from "pino";
import { CastEmbedJson, DB } from "./db";
import { HubSubscriber } from "./hubSubscriber";
import { IndexerQueue } from "./indexerQueue";
import { bytesToHex, farcasterTimeToDate, normalizeUrl } from "./util";

// If you're hitting out-of-memory errors, try decreasing this to reduce overall
// memory usage.
const MAX_PAGE_SIZE = 1_000;

// Max FIDs to fetch in parallel
const MAX_JOB_CONCURRENCY =
  Number(process.env["MAX_CONCURRENCY"]) || os.cpus().length;

export class HubReplicator {
  private client: HubRpcClient;
  private subscriber: HubSubscriber;
  private indexerQueue: IndexerQueue;

  constructor(
    private hubAddress: string,
    private ssl: boolean,
    private db: DB,
    private log: Logger
  ) {
    this.log.info(`[Sync] Connecting to hub ${hubAddress}`);
    this.client = this.ssl
      ? getSSLHubRpcClient(hubAddress)
      : getInsecureHubRpcClient(hubAddress);
    this.subscriber = new HubSubscriber(this.client, log);

    this.subscriber.on("event", async (hubEvent) => {
      if (isMergeMessageHubEvent(hubEvent)) {
        // this.log.info(
        //   `[Sync] Processing merge event ${hubEvent.id} from stream`
        // );
        await this.onMergeMessages([hubEvent.mergeMessageBody.message]);
      } else {
        this.log.warn(
          `[Sync] Unknown type ${hubEvent.type} of event ${hubEvent.id}. Ignoring`
        );
      }

      // Keep track of how many events we've processed.
      await this.db
        .insertInto("hubSubscriptions")
        .values({ host: this.hubAddress, lastEventId: hubEvent.id })
        .onConflict((oc) =>
          oc.columns(["host"]).doUpdateSet({
            lastEventId: hubEvent.id,
          })
        )
        .execute();
    });

    this.indexerQueue = new IndexerQueue(db, log);
  }

  public async start() {
    await this.indexerQueue.start();

    const infoResult = await this.client.getInfo({ dbStats: true });

    if (infoResult.isErr() || infoResult.value.dbStats === undefined) {
      throw new Error(`Unable to get information about hub ${this.hubAddress}`);
    }

    const { numMessages } = infoResult.value.dbStats;

    // Not technically true, since hubs don't return CastRemove/etc. messages,
    // but at least gives a rough ballpark of order of magnitude.
    this.log.info(
      `[Backfill] Fetching messages from hub ${this.hubAddress} (~${numMessages} messages)`
    );

    // Process live events going forward, starting from the last event we
    // processed (if there was one).
    const subscription = await this.db
      .selectFrom("hubSubscriptions")
      .where("host", "=", this.hubAddress)
      .select("lastEventId")
      .executeTakeFirst();
    this.subscriber.start(subscription?.lastEventId);

    // Start backfilling all historical data in the background
    // this.backfill();
  }

  public stop() {
    this.subscriber.stop();
  }

  public destroy() {
    this.subscriber.destroy();
  }

  private async backfill() {
    const maxFidResult = await this.client.getFids({
      pageSize: 1,
      reverse: true,
    });
    if (maxFidResult.isErr())
      throw new Error("Unable to backfill", { cause: maxFidResult.error });

    const maxFid = maxFidResult.value.fids[0];

    if (!maxFid) {
      this.log.info(`[Backfill] No FIDs to backfill`);
      return;
    }

    let totalProcessed = 0;
    const startTime = Date.now();
    const queue: queueAsPromised<{ fid: number }> = fastq.promise(
      async ({ fid }) => {
        await this.processAllMessagesForFid(fid);

        totalProcessed += 1;
        const elapsedMs = Date.now() - startTime;
        const millisRemaining = Math.ceil(
          (elapsedMs / totalProcessed) * (maxFid - totalProcessed)
        );
        this.log.info(
          `[Backfill] Completed FID ${fid}/${maxFid}. Estimated time remaining: ${humanizeDuration(
            millisRemaining
          )}.`
        );
      },
      MAX_JOB_CONCURRENCY
    );

    for (let fid = 1; fid <= maxFid; fid++) {
      queue.push({ fid });
    }

    await queue.drained();
    this.log.info(
      `[Backfill] Completed in ${humanizeDuration(Date.now() - startTime, {
        round: true,
      })}`
    );
  }

  private async processAllMessagesForFid(fid: number) {
    // Fetch all messages serially in batches to reduce memory consumption.
    // Your implementation can likely do more in parallel, but we wanted an
    // example that works on resource constrained hardware.
    for (const fn of [this.getCastsByFidInBatchesOf]) {
      for await (const messages of fn.call(this, fid, MAX_PAGE_SIZE)) {
        await this.onMergeMessages(messages);
      }
    }
  }

  private async *getCastsByFidInBatchesOf(fid: number, pageSize: number) {
    let result = await this.client.getCastsByFid({ pageSize, fid });
    for (;;) {
      if (result.isErr()) {
        throw new Error("Unable to backfill", { cause: result.error });
      }

      const { messages, nextPageToken: pageToken } = result.value;

      yield messages;

      if (!pageToken?.length) break;
      result = await this.client.getCastsByFid({ pageSize, pageToken, fid });
    }
  }

  private async onMergeMessages(messages: Message[]) {
    if (!messages?.length) return;
    if (!messages[0]) return;

    const firstMessage = messages[0]; // All messages will have the same type as the first

    if (isCastAddMessage(firstMessage)) {
      this.log.info(`[Sync] Processing cast ${bytesToHex(firstMessage.hash)}`);
      await this.onCastAdd(messages as CastAddMessage[]);
    } else if (isCastRemoveMessage(firstMessage)) {
      await this.onCastRemove(messages as CastRemoveMessage[]);
    }
  }

  private async onCastAdd(messages: CastAddMessage[]) {
    const castRowsWithEmbeds = messages.map((message) => {
      // this.log.info(`[Sync] Processing cast ${bytesToHex(message.hash)}`);
      const embedsDeprecated = message.data.castAddBody.embedsDeprecated;
      const embeds = message.data.castAddBody.embeds;
      const transformedEmbeds: CastEmbedJson[] = embedsDeprecated.length
        ? embedsDeprecated.map((url) => ({ url }))
        : embeds.map(({ castId, url }) => {
            if (castId)
              return {
                castId: {
                  fid: castId.fid,
                  hash: bytesToHex(castId.hash),
                },
              };
            if (url) return { url };
            throw new Error("Neither castId nor url is defined in embed");
          });
      return {
        timestamp: farcasterTimeToDate(message.data.timestamp),
        deletedAt: null,
        fid: message.data.fid,
        hash: message.hash,
        transformedEmbeds,
      };
    });
    await this.db
      .insertInto("casts")
      .values(
        castRowsWithEmbeds.map((castRow) => {
          return {
            timestamp: castRow.timestamp,
            deletedAt: castRow.deletedAt,
            fid: castRow.fid,
            hash: castRow.hash,
          };
        })
      )
      // Do nothing on conflict since nothing should have changed if hash is the same.
      .onConflict((oc) => oc.columns(["hash"]).doNothing())
      .execute();

    for (const castRow of castRowsWithEmbeds) {
      // Insert and embeds
      if (castRow.transformedEmbeds.length > 0) {
        const urlEmbeds = castRow.transformedEmbeds.filter((embed) =>
          Object.hasOwn(embed, "url")
        ) as { url: string }[];
        const urls = urlEmbeds.map((embed) => normalizeUrl(embed.url));

        await this.db
          .insertInto("castEmbedUrls")
          .values(
            urls.map((url) => {
              return {
                castHash: castRow.hash,
                url,
              };
            })
          )
          // .onConflict((oc) => oc.columns(["url", "castHash"]).doNothing())
          .execute();

        this.log.info(
          `[Sync] Indexed ${urls.length} URLs from cast ${bytesToHex(
            castRow.hash
          )}`
        );

        // Add any new URLs to the indexer queue
        urls.forEach((url) => this.indexerQueue.push(url));
      }
    }
  }

  private async onCastRemove(messages: CastRemoveMessage[]) {
    for (const message of messages) {
      await this.db
        .updateTable("casts")
        .where("fid", "=", message.data.fid)
        .where("hash", "=", message.data.castRemoveBody.targetHash)
        .set({ deletedAt: farcasterTimeToDate(message.data.timestamp) })
        .execute();

      // TODO: Execute any cleanup side effects to remove the cast
    }
  }
}
