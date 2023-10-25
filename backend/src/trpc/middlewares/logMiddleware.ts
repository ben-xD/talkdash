import { middleware } from "../trpc";

export const logMiddleware = middleware(async ({ path, ctx, next, type }) => {
  const appSubRouterName = path.split(".")[0];
  const start = Date.now();
  const result = await next({ ctx });
  const durationMs = Date.now() - start;
  console.info(
    JSON.stringify({
      path,
      type,
      durationMs,
      ok: result.ok,
      message: "Request complete",
      router: appSubRouterName,
    }),
  );
  return result;
});