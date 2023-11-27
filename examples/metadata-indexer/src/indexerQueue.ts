import fastq, { queueAsPromised } from "fastq";
import humanizeDuration from "humanize-duration";
import { sql } from "kysely";
import { DB } from "./db";
import { Logger } from "./log";
import { shuffle } from "./util/util";

type Job = {
  url: string;
  retries?: number;
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

  public async push(url: string) {
    await this.indexQueue.push({ url });
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
    shuffledRowsToIndex.map((row) => this.indexQueue.push(row));

    this.log.info(
      `[URL Indexer] Queued ${this.indexQueue.length()} URLs for indexing`
    );
  }

  private async worker({ url, retries = 0 }: Job): Promise<void> {
    this.log.info(`[URL Indexer] Indexing ${url}...`);
    // Check if URL has already been indexed
    const alreadyIndexed = await this.db
      .selectFrom("urlMetadata")
      .where("url", "=", url)
      .select("updatedAt")
      .executeTakeFirst();

    if (alreadyIndexed?.updatedAt) {
      this.log.info(`[URL Indexer] Skipping ${url} since it's already indexed`);
      return;
    }

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
      if (response.status === 400 && retries === 0) {
        // Retry 400 errors
        this.log.info(`[URL Indexer] Queueing retry for ${url}...`);
        this.indexQueue.push({ url, retries: retries + 1 });
      }
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

  private async indexMetadata(url: string, result: any) {
    const nftCollectionId = result.nft?.collection.id;
    const nftMetadataId = result.nft?.tokenId
      ? `${result.nft?.collection.id}/${result.nft?.tokenId}`
      : null;

    await this.db
      .insertInto("urlMetadata")
      .values({
        url,
        updatedAt: new Date(),
        imageUrl: result.image?.url,
        imageWidth: result.image?.width,
        imageHeight: result.image?.height,
        description: result.description,
        alt: result.alt,
        title: result.title,
        publisher: result.publisher,
        logoUrl: result.logo?.url,
        mimeType: result.mimeType,
        nftCollectionId: nftCollectionId,
        nftMetadataId: nftMetadataId,
      })
      .onConflict((oc) => oc.columns(["url"]).doNothing())
      .execute();

    // Insert NFT metadata if it exists
    if (result.nft?.collection && nftCollectionId) {
      const { collection } = result.nft;
      await this.db
        .insertInto("nftCollections")
        .values({
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
        })
        .onConflict((oc) => oc.columns(["id"]).doNothing())
        .execute();
    }

    if (result.nft?.tokenId && nftMetadataId && nftCollectionId) {
      await this.db
        .insertInto("nftMetadata")
        .values({
          id: nftMetadataId,
          tokenId: result.nft.tokenId,
          mediaUrl: result.nft.mediaUrl,
          nftCollectionId: nftCollectionId,
          mintUrl: result.nft.mintUrl,
        })
        .onConflict((oc) => oc.columns(["id"]).doNothing())
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
