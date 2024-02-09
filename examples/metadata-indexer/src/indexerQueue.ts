import fastq, { queueAsPromised } from "fastq";
import humanizeDuration from "humanize-duration";
import { sql } from "kysely";
import { DB, Tables } from "./db";
import { Logger } from "./log";
import { shuffle } from "./util/util";
import { InsertObjectOrList } from "kysely/dist/cjs/parser/insert-values-parser";

type Job = {
  url: string;
  retries?: number;
  // True if this job is being run as part the initial population of the queue
  resumed?: boolean;
  // Override any existing metadata
  force?: boolean;
};

export class IndexerQueue {
  private indexQueue: queueAsPromised<Job>;
  private startTime: Date | undefined;
  private jobsCompleted = 0;

  constructor(
    private db: DB,
    private log: Logger
  ) {
    const workers = parseInt(process.env["MAX_CONCURRENCY_FETCH"] || "1");
    this.log.info(`[URL Indexer] Creating queue with ${workers} workers`);
    this.indexQueue = fastq.promise(this.worker.bind(this), workers);

    this.startTime = new Date();
  }

  public async start() {
    await this.populateQueue();
  }

  public async push(url: string, options?: Omit<Job, "url">) {
    if (this.indexQueue.getQueue().find((job) => job.url === url)) {
      this.log.info(
        `[URL Indexer] Skipping ${url} since it's already in the queue`
      );
      return;
    }
    await this.indexQueue.push({ url, ...(options || {}) });
  }

  private async populateQueue() {
    if (this.indexQueue.length() > 0) return;

    // select urls from CastEmbedUrl which don't exist on the UrlMetadata table
    this.log.info(`[URL Indexer] Populating index queue...`);

    const { rows: rowsToIndex } = await sql<{ url: string }>`
    SELECT DISTINCT cast_embed_urls.url
    FROM cast_embed_urls
    LEFT JOIN url_metadata ON cast_embed_urls.url = url_metadata.url
    WHERE url_metadata.url IS NULL; `.execute(this.db);

    this.log.info(`[URL Indexer] Found ${rowsToIndex.length} URLs to index`);

    // Shuffle URLs to avoid overloading a single host
    const shuffledRowsToIndex = shuffle(rowsToIndex);
    shuffledRowsToIndex.map((row) => this.push(row.url, { resumed: true }));

    this.log.info(
      `[URL Indexer] Queued ${this.indexQueue.length()} URLs for indexing`
    );
  }

  private async worker({
    url,
    retries = 0,
    force = false,
    resumed,
  }: Job): Promise<void> {
    this.log.info(`[URL Indexer] Indexing ${url}...`);
    // Check if URL has already been indexed
    const alreadyIndexed = await this.db
      .selectFrom("urlMetadata")
      .where("url", "=", url)
      .select("updatedAt")
      .executeTakeFirst();

    // - We are no longer skipping URLs that have already been indexed
    // if (alreadyIndexed?.updatedAt && !force) {
    //   this.log.info(`[URL Indexer] Skipping ${url} since it's already indexed`);
    //   return;
    // }

    this.jobsCompleted += 1;

    // Call API, parse result, and store in DB
    const searchParams = new URLSearchParams({ url });
    const queryUrl = `${process.env[
      "OPENGRAPH_API"
    ]!}?${searchParams.toString()}`;

    this.log.info(`[URL Indexer] Fetching ${queryUrl}...`);

    let response: Response;
    try {
      response = await fetch(queryUrl);
    } catch (error) {
      this.log.error(`[URL Indexer] Failed to fetch ${queryUrl}`);
      this.log.error(error);
      return;
    }

    if (!response.ok) {
      this.log.error(
        `[URL Indexer] Response not ok [${response.status}] ${queryUrl}`
      );
      this.indexMetadata(url, null);
      return;
    }

    const result = await response.json(); // TODO: as UrlMetadata
    try {
      await this.indexMetadata(url, result);
    } catch (error) {
      this.log.error(
        `[URL Indexer] An error occurred when trying to index ${url}`
      );
      this.log.error(error);
      return;
    }

    this.log.info(
      `[URL Indexer] Indexed ${url} ${
        retries > 0 ? `${retries} retries` : ""
      }: ${JSON.stringify(result)}`
    );

    this.logProgress();
  }

  private async indexMetadata(url: string, result: any | null) {
    if (!result) {
      await this.db
        .insertInto("urlMetadata")
        .values({ updatedAt: new Date(), url })
        .onConflict((oc) => {
          return oc.columns(["url"]).doNothing();
        })
        .execute();
      return;
    }

    const nftCollectionId = result.nft?.collection.id;
    const nftMetadataId = result.nft?.tokenId
      ? `${result.nft?.collection.id}/${result.nft?.tokenId}`
      : null;

    const urlMetadataValue = {
      url,
      customOpenGraph: result.customOpenGraph || null,
      updatedAt: new Date(),
      imageUrl: result.image?.url || null,
      imageWidth: result.image?.width ? Math.floor(result.image.width) : null,
      imageHeight: result.image?.height
        ? Math.floor(result.image.height)
        : null,
      description: result.description || null,
      alt: result.alt || null,
      title: result.title || null,
      publisher: result.publisher || null,
      logoUrl: result.logo?.url || null,
      mimeType: result.mimeType || null,
      nftCollectionId: nftCollectionId || null,
      nftMetadataId: nftMetadataId || null,
    };

    await this.db
      .insertInto("urlMetadata")
      .values(urlMetadataValue)
      .onConflict((oc) => {
        return oc.columns(["url"]).doUpdateSet(urlMetadataValue);
      })
      .execute();

    // Insert NFT metadata if it exists
    if (result.nft?.collection && nftCollectionId) {
      const { collection } = result.nft;
      const collectionValue = {
        id: nftCollectionId!,
        name: collection.name,
        creatorAddress: collection.creatorAddress,
        itemCount: collection.itemCount,
        ownerCount: collection.ownerCount,
        mintUrl: collection.mintUrl,
        description: collection.description,
        imageUrl: collection.imageUrl,
        openSeaUrl: collection.openSeaUrl,
        creatorFid: collection.creator?.fid,
      };
      await this.db
        .insertInto("nftCollections")
        .values(collectionValue)
        .onConflict((oc) => oc.columns(["id"]).doUpdateSet(collectionValue))
        .execute();
    }

    if (result.nft?.tokenId && nftMetadataId && nftCollectionId) {
      const nftValue = {
        id: nftMetadataId,
        tokenId: result.nft.tokenId,
        mediaUrl: result.nft.mediaUrl,
        nftCollectionId: nftCollectionId,
        mintUrl: result.nft.mintUrl,
      };
      await this.db
        .insertInto("nftMetadata")
        .values(nftValue)
        .onConflict((oc) => oc.columns(["id"]).doUpdateSet(nftValue))
        .execute();
    }
  }

  private logProgress() {
    const elapsedSec = (new Date().getTime() - this.startTime!.getTime()) / 100;
    const rate = this.jobsCompleted / elapsedSec;
    const remainingSec = this.indexQueue.length() / rate;
    this.log.info(
      `[URL Indexer] URLs remaining: ${this.indexQueue.length()} ETA: ${humanizeDuration(
        remainingSec * 1000,
        { round: true }
      )} (${Math.round(rate * 100) / 100} URLs/sec)`
    );
  }
}
