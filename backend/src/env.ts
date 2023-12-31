import { z } from "zod";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "node:path";

// You may consider using config files instead of environment variables (yaml and zod)
// however, changing configs becomes harder when Kubernetes is not used.
// For example, how do you swap config files in Fly.io? We'd need to include
// multiple configuration files to pick between them, or upload them remotely.

// For more environment variables available on Fly, see
// https://fly.io/docs/reference/runtime-environment/

const envSchema = z.object({
  LOG_FASTIFY: z.coerce.boolean().default(false),
  LOG_DATABASE: z.coerce.boolean().default(false),
  LOG_TEST_DATABASE: z.coerce.boolean().default(false),
  LOG_TRPC_REQUEST: z.coerce.boolean().default(false),
  OPENAI_API_KEY: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_WORKERS_AI_TOKEN: z.string(),
  FLY_APP_NAME: z.string().optional(),
  DATABASE_URL: z
    .string()
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
    .union([z.literal("production"), z.literal("development"), z.undefined()])
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
  AUTH_GOOGLE: z.coerce
    .boolean()
    .default(false)
    .describe("Enable Google OAuth."),
});

export const githubOAuthConfigSchema = z.object({
  AUTH_GITHUB_ID: z.string(),
  AUTH_GITHUB_SECRET: z.string(),
});

export const googleOAuthConfigSchema = z.object({
  GOOGLE_ID: z.string(),
  GOOGLE_SECRET: z.string(),
  GOOGLE_REDIRECT_URI: z.string(),
});
export type GoogleOAuthConfig = z.infer<typeof googleOAuthConfigSchema>;

// Possible approach when using config instead of environment variables
// const configSchema = z.object({
//   oAuth: z
//     .object({
//       google: z.object({
//         clientId: z.string(),
//         clientSecret: z.string(),
//         redirectUri: z.string(),
//       }),
//     })
//     .optional(),
// });

// Load environment variables just before reading and validating them
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dotenvPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: dotenvPath });
export const env = envSchema.parse(process.env);
