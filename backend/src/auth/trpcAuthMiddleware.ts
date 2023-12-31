import { middleware } from "../trpc/trpc.js";
import { throwUnauthenticatedError } from "./errors.js";

// Rejects unauthenticated requests
export const trpcAuthRequiredMiddleware = middleware(async ({ ctx, next }) => {
  const { clientProtocol } = ctx;
  if (clientProtocol === "ws") {
    if (ctx.connectionContext && !ctx.connectionContext.session) {
      throwUnauthenticatedError("Not yet authenticated");
    }
  } else if (clientProtocol === "http") {
    if (!ctx.session) {
      throwUnauthenticatedError("Not yet authenticated");
    }
  } else {
    return clientProtocol satisfies never;
  }

  return await next({ ctx });
});

// Validates session for each request. Renews session if it's valid.
// Uses https://trpc.io/docs/server/middlewares#context-extension
export const trpcAuthSessionMiddleware = middleware(async ({ ctx, next }) => {
  const { clientProtocol } = ctx;
  if (clientProtocol === "ws") {
    const session = ctx.connectionContext?.session;
    const sessionId = session?.sessionId;
    try {
      if (sessionId) {
        await ctx.auth.validateSession(sessionId);
      }
      return next({ ctx: { ...ctx, session } });
    } catch (error) {
      console.error(error);
      throwUnauthenticatedError();
    }
  }
  return next({ ctx });
});
