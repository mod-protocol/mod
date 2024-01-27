import { DB } from "../db";

export const up = async (db: DB) => {
  await db.schema
    .alterTable("urlMetadata")
    .addColumn("customOpenGraph", "jsonb")
    .execute();
};

export const down = async (db: DB) => {
  await db.schema
    .alterTable("urlMetadata")
    .dropColumn("customOpenGraph")
    .execute();
};
