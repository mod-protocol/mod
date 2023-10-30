import { DB, getDbClient, migrateToLatest, migrationStatus } from "./db";
import { HubReplicator } from "./hubReplicator";
import { Logger, log } from "./log";
import { onTerminate, terminateProcess } from "./util";
import "dotenv/config";

/**
 * Populate the following constants with your own values.
 *
 * If you're running this from the examples directory, make sure you follow the
 * README.
 */
const HUB_HOST = process.env["HUB_HOST"] || "nemes.farcaster.xyz:2283";
const HUB_SSL = (process.env["HUB_SSL"] || "true") === "true";
const POSTGRES_URL =
  process.env["POSTGRES_URL"] || "postgres://app:password@localhost:6541/hub";

let replicator: HubReplicator | undefined;

const db = getDbClient(POSTGRES_URL);
onTerminate(async () => {
  log.debug("Disconnecting from database");
  await db.destroy();
});

const migrateDb = async (db: DB, log: Logger) => {
  try {
    await migrateToLatest(db, log);
  } catch (error) {
    log.error(error);
    await terminateProcess({ success: false, log });
  }
};

const ensureMigrationsUpToDate = async (db: DB, log: Logger) => {
  const { executed, pending } = await migrationStatus(db);
  if (executed.length === 0) {
    log.info(
      "Detected no prior migrations have been run. Running migrations now."
    );
    await migrateDb(db, log);
  } else if (pending.length > 0) {
    log.error(`Detected ${pending.length} pending migrations.`);
    log.error(
      "Please run migrations with `replicator migrate` before starting the replicator."
    );
    process.exit(1);
  }
};

async function migrate() {
  await migrateDb(db, log);
  await terminateProcess({ success: true, log });
}

async function start() {
  await ensureMigrationsUpToDate(db, log);

  // Start replicator
}

(async () => {
  // Create DB tables
  await migrateToLatest(db, log);

  replicator = new HubReplicator(HUB_HOST, HUB_SSL, db, log);
  replicator.start();
})();
