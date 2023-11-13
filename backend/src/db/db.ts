import pg from "pg";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { env } from "../env.js";
import { setupWsProxyConfig } from "./wsProxy.js";
import * as schema from "./schema/index.js";

export const migrationsFolder = "./migrations";

export const connectToDb = async () => {
  if (env.SERVERLESS_DATABASE_LOCAL_WS_PROXY) {
    setupWsProxyConfig(env.SERVERLESS_DATABASE_LOCAL_WS_PROXY);
  }
  const connectionString = env.DATABASE_URL;

  const dbPool = new pg.Pool({ connectionString });
  const db = drizzle(dbPool, { logger: env.LOG_DATABASE, schema });
  await migrate(db, { migrationsFolder });
  return { db, dbPool };
};

export type Database = NodePgDatabase<typeof schema>;
