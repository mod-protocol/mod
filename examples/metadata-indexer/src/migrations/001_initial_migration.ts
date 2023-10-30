import { Kysely, sql } from "kysely";
import { DB } from "../db";

/**************************************************************************************************
  Notes about the patterns in this file:

  * Uses features introduced in Postgres 15, so this will not work on older versions.
   
  * Uses ULIDs as the surrogate key for most tables so that we don't rely on sequences, allowing
    tables to be partitioned in the future if needed. ULIDs still have temporal ordering unlike 
    most UUIDs.

  * Uses created_at/updated_at columns to refer to database row create/update time, NOT 
    the creation time of the entity on the Farcaster network itself. 
    Separate columns (e.g. "timestamp") represent when the content was created on Farcaster.

  * Declares columns in a particular order to minimize storage on disk. If the declaration order 
    looks odd, remember it's to reduce disk space. 
    See https://www.2ndquadrant.com/en/blog/on-rocks-and-sand/ for more info.

  * Uses bytea columns to store raw bytes instead of text columns with `0x` prefixed strings, since
    raw bytes reduce storage space, reduce index size, are faster to query (especially with joins), 
    and avoid case sensitivity issues when dealing with string comparison.

  * Uses B-tree indexes (the default) for most columns representing a hash digest, since you can 
    perform lookups on those hashes matching by prefix, whereas you can't do this with hash indexes.
  
  * Declares some indexes that we think might be useful for data analysis and general querying, 
    but which aren't actually required by the replicator itself.

  * Declares partial indexes (via a WHERE predicate) to reduce the size of the index and ensure
    only relevant rows are returned (e.g. ignoring soft-deleted rows, etc.)

  * Uses JSON columns instead of native Postgres array columns to significantly reduce on-disk 
    storage (JSON is treated like TEXT) at the cost of slightly slower querying time. JSON columns
    can also be more easily modified over time without requiring a schema migration.

  * Declares foreign keys to ensure correctness. This means that the replicator will not process 
    a message if it refers to content that has not yet been seen, since that would violate the FK 
    constraint. Instead, it will put the message into an unprocessed message queue and try again 
    once the content it references has been processed. If you want to remove data that was 
    pruned/revoked/deleted, you can hard delete the corresponding row in the messages table, and 
    the downstream tables referencing that message will also be deleted.
**************************************************************************************************/

// biome-ignore lint/suspicious/noExplicitAny: legacy code, avoid using ignore for new code
export const up = async (db: DB) => {
  // HUB SUBSCRIPTIONS ----------------------------------------------------------------------------
  // export type HubSubscriptionsRow = {
  //   host: string;
  //   lastEventId: number;
  // };
  await db.schema
    .createTable("hubSubscriptions")
    .addColumn("host", "text", (col) => col.notNull().primaryKey())
    .addColumn("last_event_id", "bigint")
    .execute();

  // CASTS ----------------------------------------------------------------------------------------
  // type CastRow = {
  //   id: GeneratedAlways<string>;
  //   createdAt: Generated<Date>;
  //   updatedAt: Generated<Date>;
  //   timestamp: Date;
  //   deletedAt: Date | null;
  //   fid: Fid;
  //   hash: Uint8Array;
  // };
  await db.schema
    .createTable("casts")
    .addColumn("id", "bigint", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey()
    )
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("updatedAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("timestamp", "timestamptz", (col) => col.notNull())
    .addColumn("deletedAt", "timestamptz")
    .addColumn("fid", "bigint", (col) => col.notNull())
    .addColumn("hash", "bytea", (col) => col.notNull())
    .$call((qb) =>
      qb
        // .addPrimaryKeyConstraint("casts_pkey", ["id"])
        .addUniqueConstraint("casts_hash_unique", ["hash"])
    )
    .execute();

  await db.schema
    .createTable("urlMetadata")
    .addColumn("id", "bigint", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey()
    )
    .addColumn("url", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("updatedAt", "timestamptz")
    .addColumn("imageUrl", "text")
    .addColumn("imageWidth", "integer")
    .addColumn("imageHeight", "integer")
    .addColumn("description", "text")
    .addColumn("alt", "text")
    .addColumn("title", "text")
    .addColumn("publisher", "text")
    .addColumn("logoUrl", "text")
    .addColumn("mimeType", "text")
    .addColumn("nftCollectionId", "text")
    .addColumn("nftMetadataId", "text")
    .$call((qb) =>
      qb
        // .addPrimaryKeyConstraint("urlMetadata_pk", ["id"])
        .addUniqueConstraint("urlMetadata_url", ["url"])
    )
    .execute();

  // type NftCollection = {
  //   id: GeneratedAlways<string>;
  //   createdAt: Generated<Date>;
  //   updatedAt: Generated<Date>;
  //   name: string;
  //   collectionAddress: string;
  //   description: string;
  //   creatorAddress: string;
  //   itemCount: number;
  //   ownerCount: number;
  //   imageUrl: string;
  //   mintUrl: string;
  //   openSeaUrl: string | null;
  //   creatorFid: Fid | null;
  //   chain: string;
  // };
  await db.schema
    .createTable("nftCollections")
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("updatedAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    // CAIP-19 ID
    .addColumn("id", "text", (col) => col.notNull())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("creatorAddress", "text", (col) => col.notNull())
    .addColumn("itemCount", "integer", (col) => col.notNull())
    .addColumn("ownerCount", "integer", (col) => col.notNull())
    .addColumn("mintUrl", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("imageUrl", "text")
    .addColumn("openSeaUrl", "text")
    .addColumn("creatorFid", "bigint")
    .$call((qb) =>
      qb
        .addPrimaryKeyConstraint("nftCollections_pkey", ["id"])
        .addUniqueConstraint("nftCollections_id", ["id"])
    )
    .execute();

  // type NftMetadata = {
  //   id: GeneratedAlways<string>;
  //   createdAt: Generated<Date>;
  //   updatedAt: Generated<Date>;
  //   tokenId: string;
  //   mediaUrl: string;
  //   nftCollectionId: string;
  // };
  await db.schema
    .createTable("nftMetadata")
    // CAIP-19 ID
    .addColumn("id", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("updatedAt", "timestamptz", (col) =>
      col.notNull().defaultTo(sql`current_timestamp`)
    )
    .addColumn("tokenId", "text", (col) => col.notNull())
    .addColumn("mediaUrl", "text", (col) => col)
    .addColumn("nftCollectionId", "text", (col) => col.notNull())
    .$call(
      (qb) =>
        qb
          .addPrimaryKeyConstraint("nftMetadata_pkey", ["id"])
          .addUniqueConstraint("nftMetadata_tokenId", ["tokenId"])
      // .addForeignKeyConstraint(
      //   "nftMetadata_nftCollectionId_fk",
      //   ["nftCollectionId"],
      //   "nftCollections",
      //   ["id"]
      // )
    )
    .execute();

  // CAST EMBED URL ------------------------------------------------------------------------------
  // export type CastEmbedUrl = { ... };
  await db.schema
    .createTable("castEmbedUrls")
    .addColumn("id", "bigint", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey()
    )
    .addColumn("castHash", "bytea", (col) => col.notNull())
    .addColumn("url", "text", (col) => col.notNull())
    .$call(
      (qb) => qb
      // .addForeignKeyConstraint(
      //   "castEmbedUrl_castHash_fk",
      //   ["castHash"],
      //   "casts",
      //   ["hash"]
      // )
      // .addForeignKeyConstraint(
      //   "castEmbedUrl_url_fk",
      //   ["url"],
      //   "urlMetadata",
      //   ["url"]
      // )
      // .addPrimaryKeyConstraint("castEmbedUrl_pkey", ["castHash", "url"])
    )
    .execute();
};

export const down = async (db: DB) => {
  // Delete in reverse order of above so that foreign keys are not violated.
  await db.schema.dropTable("castEmbedUrls").ifExists().execute();
  await db.schema.dropTable("urlMetadata").ifExists().execute();
  await db.schema.dropTable("nftMetadata").ifExists().execute();
  await db.schema.dropTable("nftCollections").ifExists().execute();
  await db.schema.dropTable("casts").ifExists().execute();
  await db.schema.dropTable("hubSubscriptions").ifExists().execute();
};
