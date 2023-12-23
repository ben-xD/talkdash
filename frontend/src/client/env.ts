import { z } from "zod";

// Only use import.meta.env in this file.

const envSchema = z.object({
  VITE_BACKEND_URL: z.string().min(1),
  VITE_SENTRY_DSN: z.string().min(1),
  VITE_POSTHOG_CLIENT_TOKEN: z.string().min(1),
});
type EnvSchema = z.infer<typeof envSchema>;

// We access the environment variables directly here instead of using `envSchema.parse(import.meta.env)` because
// vite won't replace the environment variables in the build if we do that.
export const validateEnv = () =>
  envSchema.parse({
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
    VITE_POSTHOG_CLIENT_TOKEN: import.meta.env.VITE_POSTHOG_CLIENT_TOKEN,
  } satisfies EnvSchema);

export const env = validateEnv();
