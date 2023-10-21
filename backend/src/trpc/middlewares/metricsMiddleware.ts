import { middleware } from "../trpc";

export const metricsMiddleware = middleware(async ({ ctx, next }) => {
  // TODO add metrics.
  const result = await next({ ctx });
  return result;
});
