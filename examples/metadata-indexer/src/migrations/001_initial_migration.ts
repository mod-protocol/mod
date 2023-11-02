import { sql } from "kysely";
import { DB } from "../db";

export const up = async (db: DB) => {
  await db.schema
    .createTable("hubSubscriptions")
    .addColumn("host", "text", (col) => col.notNull().primaryKey())
    .addColumn("last_event_id", "bigint")
    .execute();

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
    .$call((qb) => qb.addUniqueConstraint("casts_hash_unique", ["hash"]))
    .execute();

  await db.schema
    .createIndex("casts_hash_index")
    .on("casts")
    .column("hash")
    .execute();

  await db.schema
    .createTable("urlMetadata")
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
        .addPrimaryKeyConstraint("urlMetadata_pk", ["url"])
        .addUniqueConstraint("urlMetadata_url", ["url"])
    )
    .execute();

  await db.schema
    .createIndex("url_metadata_url_index")
    .on("urlMetadata")
    .column("url")
    .execute();

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

  await db.schema
    .createIndex("nft_collections_id_index")
    .on("nftCollections")
    .column("id")
    .execute();

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
    .$call((qb) => qb.addPrimaryKeyConstraint("nftMetadata_pkey", ["id"]))
    .execute();

  await db.schema
    .createIndex("nft_metadata_id_index")
    .on("nftMetadata")
    .column("id")
    .execute();

  await db.schema
    .createTable("castEmbedUrls")
    .addColumn("id", "bigint", (col) =>
      col.generatedAlwaysAsIdentity().primaryKey()
    )
    .addColumn("castHash", "bytea", (col) => col.notNull())
    .addColumn("url", "text", (col) => col.notNull())
    .addColumn("unnormalizedUrl", "text", (col) => col.notNull())
    .addColumn("index", "integer", (col) => col.notNull())
    .$call((qb) =>
      qb.addUniqueConstraint("castEmbedUrls_hash_url_unique", [
        "url",
        "castHash",
        "index",
      ])
    )
    .execute();

  await db.schema
    .createIndex("cast_embed_urls_cast_hash_index")
    .on("castEmbedUrls")
    .column("castHash")
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
