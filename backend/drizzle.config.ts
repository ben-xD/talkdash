import type { Config } from "drizzle-kit";
import { env } from "./src/env.js";
import { migrationsFolder } from "./src/db/db.js";
import path from "path";

// Drizzle appends a `./` to the `out` path, so we need to get the relative path
const out = path.relative(__dirname, migrationsFolder);

export default {
  // Warning: using `./src/db/schema/index` or `/src/db/schema/` doesn't work
  schema: "./src/db/schema/index.ts",
  out,
  // Does pg work with neon?
  // Yes, I'm just using pg/postgres-node, without the neon serverless drivers.
  driver: "pg",
  breakpoints: true,
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
} satisfies Config;
