import { Kysely, PostgresDialect } from "kysely";
import { DB } from "../types/db";
import { createKysely } from "@vercel/postgres-kysely";
import { Pool } from "pg";

export const db =
  process.env.NODE_ENV !== "production"
    ? new Kysely<DB>({
        dialect: new PostgresDialect({
          pool: new Pool({
            connectionString: process.env.DATABASE_URL,
          }),
        }),
      })
    : createKysely<DB>({
        connectionString: process.env.DATABASE_URL,
      });
