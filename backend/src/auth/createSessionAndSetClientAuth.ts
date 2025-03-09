// If http, then we use cookies. If websocket, then we use bearer tokens
import { TrpcContext } from "../trpc/trpcContext.js";

export const createSessionAndSetClientAuth = async (
  ctx: TrpcContext,
  userId: string,
  username: string,
) => {
  const session = await ctx.auth.createSession({
    userId,
    attributes: {
      created_at: new Date(),
    },
  });
  const clientProtocol = ctx.clientProtocol;
  if (clientProtocol === "http") {
    // Cookie based auth
    // TODO figure out the error
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (ctx.req && ctx.res) {
      const referer = ctx.req.headers["referer"];
      const sessionCookie = ctx.auth.createSessionCookie(session);
      if (referer && new URL(referer).pathname === "/trpc") {
        ctx.res.header("Set-Cookie", sessionCookie.serialize()); // store session cookie on client
        // Don't redirect because the client app is trpc-panel (generated UI testing similar to Swagger UI)
      } else {
        ctx.res.header("Location", "/");
        ctx.res.status(302);
      }
    }
  } else if (clientProtocol === "ws") {
    // Bearer token based auth
    ctx.connectionContext.session = session;
  } else {
    return clientProtocol satisfies never;
  }
  return { bearerToken: session.sessionId, username };
};
