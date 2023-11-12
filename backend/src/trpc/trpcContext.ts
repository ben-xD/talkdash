import { inferAsyncReturnType } from "@trpc/server";

import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { Database } from "../db/db.js";
import { Auth } from "../auth/auth.js";
import { Session } from "lucia";

//  This is only called when the http request is made. Not for every websocket message.
// We identify it's the same user in the same context by updating the ctx.session in the authRouter.
export const createTrpcCreateContext =
  (db: Database, auth: Auth) =>
  async ({ req, res }: CreateFastifyContextOptions) => {
    // See https://lucia-auth.com/reference/lucia/interfaces/auth/#handlerequest
    // and https://lucia-auth.com/reference/lucia/modules/middleware/
    const authRequest = auth.handleRequest(req, res);
    // Using cookies: https://lucia-auth.com/basics/using-cookies/
    // TODO check session is null when called from untrusted origin
    let session = await authRequest.validate();

    if (!session) {
      // Using bearer tokens: https://lucia-auth.com/basics/using-bearer-tokens/
      session = await authRequest.validateBearerToken();
    }

    const connectionContext = {} satisfies ConnectionContext;

    return {
      req,
      res,
      db,
      auth,
      // if session is defined, it's valid request. See https://lucia-auth.com/basics/using-cookies/
      session,
      connectionContext,
    };
  };

export type TrpcContext = inferAsyncReturnType<
  ReturnType<typeof createTrpcCreateContext>
>;

export type ConnectionContext = { session?: Session };
