import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { Database } from "../db/db.js";
import { Auth, OAuths } from "../auth/auth.js";
import { Session } from "lucia";
import { FastifyReply, FastifyRequest } from "fastify";

//  This is only called for every new http request is made. For websockets, this means only the initial upgrade request.
// We identify it's the same user in the same context by setting the ctx.connectionContext.
// This is called before the middleware
export const createTrpcCreateContext =
  (db: Database, auth: Auth, oAuths: OAuths) =>
  async ({ req, res }: CreateFastifyContextOptions): Promise<TrpcContext> => {
    // See https://lucia-auth.com/reference/lucia/interfaces/auth/#handlerequest
    // and https://lucia-auth.com/reference/lucia/modules/middleware/
    const authRequest = auth.handleRequest(req, res);
    // Using cookies: https://lucia-auth.com/basics/using-cookies/
    // TODO check session is null when called from untrusted origin
    // if session is defined, it's valid request. See https://lucia-auth.com/basics/using-cookies/
    let session = await authRequest.validate();
    if (!session) {
      // Using bearer tokens: https://lucia-auth.com/basics/using-bearer-tokens/
      session = await authRequest.validateBearerToken();
    }

    const clientProtocol: "ws" | "http" = req.headers.upgrade ? "ws" : "http";

    if (clientProtocol === "ws") {
      return {
        clientProtocol,
        db,
        auth,
        oAuths,
        connectionContext: { session } as ConnectionContext,
      };
    } else if (clientProtocol === "http") {
      return {
        clientProtocol,
        db,
        auth,
        oAuths,
        session: session ?? undefined,
        req,
        res,
      };
    } else {
      return clientProtocol satisfies never;
    }
  };

type TrpcContextBase = {
  db: Database;
  auth: Auth;
  oAuths: OAuths;
};

export type TrpcContext =
  | (TrpcContextBase & {
      clientProtocol: "ws";
      connectionContext: ConnectionContext;
    })
  | (TrpcContextBase & {
      clientProtocol: "http";
      session: Session | undefined;
      req: FastifyRequest;
      res: FastifyReply;
    });

export type ConnectionContext = {
  session?: Session;
  temporaryUsername?: string;
};
