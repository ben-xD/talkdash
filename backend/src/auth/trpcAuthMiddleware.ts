import { middleware } from "../trpc/trpc.js";
import { TRPCError } from "@trpc/server";

// Rejects unauthenticated requests
export const trpcAuthRequiredMiddleware = middleware(async ({ ctx, next }) => {
  if (!ctx.connectionContext.session && !ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }
  return await next({ ctx });
});

// Validates session for each request. Renews session if it's valid.
// Uses https://trpc.io/docs/server/middlewares#context-extension
export const trpcAuthSessionMiddleware = middleware(async ({ ctx, next }) => {
  const session = ctx.connectionContext.session;
  const sessionId = session?.sessionId;
  if (sessionId) {
    await ctx.auth.validateSession(sessionId);
  }
  return next({ ctx: { ...ctx, session } });
});
