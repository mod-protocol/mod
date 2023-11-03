import fastq, { queueAsPromised } from "fastq";
import { DB } from "./db";
import { Logger } from "./log";
import humanizeDuration from "humanize-duration";
import { shuffle } from "./util/util";

export class IndexerQueue {
  private indexQueue: queueAsPromised<{ url: string }>;
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
    const urlsToIndex = await this.db
      .selectFrom("castEmbedUrls")
      .leftJoin("urlMetadata", (join) =>
        join.on("castEmbedUrls.url", "=", "urlMetadata.url")
      )
      .where("urlMetadata.url", "is", null)
      .select("castEmbedUrls.url")
      .distinct()
      .execute();

    this.log.info(`[URL Indexer] Found ${urlsToIndex.length} URLs to index`);

    // Shuffle URLs to avoid overloading a single host
    const shuffledUrlsToIndex = shuffle(urlsToIndex);

    shuffledUrlsToIndex.map((row) => this.indexQueue.push(row));
    this.log.info(
      `[URL Indexer] Queued ${this.indexQueue.length()} URLs for indexing`
    );
  }

  private async worker({ url }: { url: string }): Promise<void> {
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

    const response = await fetch(queryUrl);

    if (!response.ok) {
      this.log.error(
        `[URL Indexer] Failed to fetch ${queryUrl}: ${JSON.stringify(
          await response.text()
        )}`
      );
      return;
    }

    const result = await response.json(); // TODO: as UrlMetadata
    this.indexMetadata(url, result);

    this.log.info(`[URL Indexer] Indexed ${url}: ${JSON.stringify(result)}`);

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
