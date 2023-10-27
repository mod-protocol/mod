import { Kysely, PostgresDialect } from "kysely";
import { DB } from "../types/db";
import { Pool } from "pg";

// Client is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForDb = global as unknown as {
  db: Kysely<DB> | undefined;
};

export const db =
  globalForDb.db ??
  new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    }),
  });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;
