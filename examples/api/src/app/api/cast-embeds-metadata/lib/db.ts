import { createKysely } from "@vercel/postgres-kysely";
import { DB } from "../types/db";

export const db = createKysely<DB>({
  connectionString: process.env.DATABASE_URL,
});
