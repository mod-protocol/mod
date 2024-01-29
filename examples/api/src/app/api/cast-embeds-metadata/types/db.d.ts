import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface CastEmbedUrls {
  cast_hash: Buffer;
  id: Generated<Int8>;
  index: number;
  unnormalized_url: string;
  url: string;
}

export interface Casts {
  created_at: Generated<Timestamp>;
  deleted_at: Timestamp | null;
  fid: Int8;
  hash: Buffer;
  id: Generated<Int8>;
  timestamp: Timestamp;
  updated_at: Generated<Timestamp>;
}

export interface HubSubscriptions {
  host: string;
  last_event_id: Int8 | null;
}

export interface NftCollections {
  created_at: Generated<Timestamp>;
  creator_address: string;
  creator_fid: Int8 | null;
  description: string | null;
  id: string;
  image_url: string | null;
  item_count: number;
  mint_url: string | null;
  name: string;
  open_sea_url: string | null;
  owner_count: number;
  updated_at: Generated<Timestamp>;
}

export interface NftMetadata {
  created_at: Generated<Timestamp>;
  id: string;
  media_url: string | null;
  mint_url: string | null;
  nft_collection_id: string;
  token_id: string;
  updated_at: Generated<Timestamp>;
}

export interface UrlMetadata {
  alt: string | null;
  created_at: Generated<Timestamp>;
  custom_open_graph: Json | null;
  description: string | null;
  image_height: number | null;
  image_url: string | null;
  image_width: number | null;
  logo_url: string | null;
  mime_type: string | null;
  nft_collection_id: string | null;
  nft_metadata_id: string | null;
  publisher: string | null;
  title: string | null;
  updated_at: Timestamp | null;
  url: string;
}

export interface DB {
  cast_embed_urls: CastEmbedUrls;
  casts: Casts;
  hub_subscriptions: HubSubscriptions;
  nft_collections: NftCollections;
  nft_metadata: NftMetadata;
  url_metadata: UrlMetadata;
}
