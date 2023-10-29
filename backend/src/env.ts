import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

// TODO Replace environment variables usage with config files (yaml and zod).
// TODO move the following logger options into the config file
export const enableDatabaseLogging = false;
export const enableFastityLogging = false;
export const enableTrpcRequestLogging = false;

const envValidator = z.object({
  OPENAI_API_KEY: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_WORKERS_AI_TOKEN: z.string(),
  // Temporary disabled since we don't connect to a database.
  DATABASE_URL: z
    .string()
    .default("UNSET") // temporary set because we don't connect to db
    .describe(
      [
        "Connection string to postgres database, starting with `postgres://`.",
        "Can be local or remote. Get the remote database from your project.",
        "https://console.neon.tech/app/projects/project-name",
      ].join(" "),
    ),
  PORT: z
    .string()
    .describe(
      [
        "The port the backend application should listen on.",
        "Useful when hosting on services that want to configure which",
        "port is listened on, like Fly.io. Defaults to 4000.",
      ].join(" "),
    )
    .optional(),
  ENVIRONMENT: z
    .union([z.literal("production"), z.literal("development")])
    .describe(
      "A flag to toggle features based on environment. Code should minimise usage of this.",
    ),
  SERVERLESS_DATABASE_LOCAL_WS_PROXY: z
    .string()
    .optional()
    .describe(
      [
        "Only used when connecting to a local database. ",
        "The port to a websocket proxy for a local database.",
        "The websocket proxy is run using docker.",
        "Migration still happens over the original port.",
        "The DATABASE_URL will be mutated to use wsproxy port, see https://gal.hagever.com/posts/running-vercel-postgres-locally.",
      ].join(" "),
    ),
  INSIDE_DOCKER: z.coerce.boolean().default(false),
});
export const env = envValidator.parse(process.env);
