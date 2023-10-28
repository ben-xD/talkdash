import type { Config } from "drizzle-kit";
import { migrationsFolder } from "./src/db/db.js";
import { env } from "./src/env.js";

export default {
  schema: "./src/db/schema",
  out: migrationsFolder,
  // Does pg work with neon?
  // Yes, I'm just using pg/postgres-node, without the neon serverless drivers.
  driver: "pg",
  breakpoints: true,
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;
