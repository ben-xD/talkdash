import { middleware } from "../trpc/trpc.js";
import { TRPCError } from "@trpc/server";

export const trpcAuthMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.connectionContext.session && !ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return await next({ ctx });
});
