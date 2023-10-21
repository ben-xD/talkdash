import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envValidator = z.object({
  DATABASE_URL: z
    .string()
    .describe(
      [
        "Connection string to postgres database, starting with `postgres://`.",
        "Can be local or remote. Get the remote database from your project.",
        "https://console.neon.tech/app/projects/project-name",
      ].join(" "),
    ),
  ENVIRONMENT: z
    .union([z.literal("production"), z.literal("development")])
    .describe(
      "A flag to toggle features based on environment. Code should minimise usage of this.",
    ),
  DATABASE_LOCAL_WS_PROXY: z
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
});
export const env = envValidator.parse(process.env);
