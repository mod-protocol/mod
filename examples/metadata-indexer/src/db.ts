import {
  CamelCasePlugin,
  ColumnType,
  FileMigrationProvider,
  Generated,
  GeneratedAlways,
  Kysely,
  MigrationInfo,
  Migrator,
  PostgresDialect,
} from "kysely";
import { Pool, types } from "pg";
import Cursor from "pg-cursor";
import { promises as fs } from "fs";
import * as path from "path";
import { Logger } from "./log";

// BigInts will not exceed Number.MAX_SAFE_INTEGER for our use case.
// Return as JavaScript's `number` type so it's easier to work with.
types.setTypeParser(20, (val) => Number(val));

export type Fid = number;
export type Hex = `0x${string}`;

type CastIdJson = {
  fid: Fid;
  hash: Hex;
};

export type CastEmbedJson = { url: string } | { castId: CastIdJson };

export type CastAddBodyJson =
  | {
      text: string;
      embeds?: CastEmbedJson[];
      mentions?: Fid[];
      mentionsPositions?: number[];
    }
  | { parentUrl: string }
  | { parentCastId: CastIdJson };

export type CastRemoveBodyJson = {
  targetHash: Hex;
};

export type HubSubscriptionsRow = {
  host: string;
  lastEventId: number;
};

export type CastRow = {
  id: GeneratedAlways<string>;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  timestamp: Date;
  deletedAt: Date | null;
  fid: Fid;
  hash: Uint8Array;
};

export type NftCollectionRow = {
  id: string; // CAIP-19 ID
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  name: string;
  // contractAddress: string;
  // chain: string;
  description: string | null;
  creatorAddress: string;
  itemCount: number;
  ownerCount: number;
  imageUrl: string | null;
  mintUrl: string;
  openSeaUrl: string | null;
  creatorFid: Fid | null;
};

export type NftMetadataRow = {
  id: string; // CAIP-19 ID
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
  tokenId: string;
  mediaUrl: string | null;
  nftCollectionId: string;
};

export type CastEmbedUrlRow = {
  castHash: Uint8Array;
  url: string;
};

export type UrlMetadataRow = {
  id: GeneratedAlways<string>;
  url: string;
  createdAt: Generated<Date>;
  updatedAt: Date | null; // null means it hasn't been indexed yet
  imageUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  description: string | null;
  alt: string | null;
  title: string | null;
  publisher: string | null;
  logoUrl: string | null;
  mimeType: string | null;
  nftCollectionId: string | null;
  nftMetadataId: string | null;
};

export interface Tables {
  hubSubscriptions: HubSubscriptionsRow;
  casts: CastRow;
  urlMetadata: UrlMetadataRow;
  nftCollections: NftCollectionRow;
  nftMetadata: NftMetadataRow;
  castEmbedUrls: CastEmbedUrlRow;
}

export const getDbClient = (connectionString?: string) => {
  return new Kysely<Tables>({
    dialect: new PostgresDialect({
      pool: new Pool({
        max: 10,
        connectionString,
      }),
      cursor: Cursor,
    }),
    plugins: [new CamelCasePlugin()],
    log: ["error"],
  });
};

const createMigrator = async (db: Kysely<Tables>) => {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });

  return migrator;
};

export const migrationStatus = async (
  db: Kysely<Tables>
): Promise<{ executed: MigrationInfo[]; pending: MigrationInfo[] }> => {
  const migrator = await createMigrator(db);

  const migrations = await migrator.getMigrations();
  const executed: MigrationInfo[] = [];
  const pending: MigrationInfo[] = [];
  for (const migration of migrations) {
    if (migration.executedAt) {
      executed.push(migration);
    } else {
      pending.push(migration);
    }
  }

  return { executed, pending };
};

export const migrateToLatest = async (
  db: Kysely<Tables>,
  log: Logger
): Promise<void> => {
  const migrator = await createMigrator(db);

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      log.info(`Migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      log.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    log.error("Failed to apply all database migrations");
    throw error;
  }

  log.info("Migrations up to date");
};

export const migrateOneUp = async (
  db: Kysely<Tables>,
  log: Logger
): Promise<void> => {
  const migrator = await createMigrator(db);

  const { error, results } = await migrator.migrateUp();

  results?.forEach((it) => {
    if (it.status === "Success") {
      log.info(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      log.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    log.error("failed to migrate");
    throw error;
  }
};

export type DB = Kysely<Tables>;
