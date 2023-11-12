import { middleware } from "../trpc.js";

export const trpcMetricsMiddleware = middleware(async ({ ctx, next }) => {
  // TODO add metrics.
  const result = await next({ ctx });
  return result;
});
