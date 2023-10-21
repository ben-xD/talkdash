import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { env } from "../env";
import { setupWsProxyConfig } from "./wsProxy";
import * as schema from "./schema";

export const migrationsFolder = "./migrations";

export const connectToDb = async () => {
  if (env.DATABASE_LOCAL_WS_PROXY) {
    setupWsProxyConfig(env.DATABASE_LOCAL_WS_PROXY);
  }
  const connectionString = env.DATABASE_URL;

  const pool = new Pool({ connectionString });
  const db = drizzle(pool, { logger: true, schema });
  await migrate(db, { migrationsFolder });
  return db;
};
