import { inferAsyncReturnType } from "@trpc/server";

import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { Database } from "../db/db.js";
import { Auth } from "../auth/auth.js";

export const createTrpcCreateContext =
  (db: Database, auth: Auth) =>
  async ({ req, res }: CreateFastifyContextOptions) => {
    // See https://lucia-auth.com/reference/lucia/interfaces/auth/#handlerequest
    // and https://lucia-auth.com/reference/lucia/modules/middleware/
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();

    return {
      req,
      res,
      db,
      auth,
      session,
    };
  };

export type TrpcContext = inferAsyncReturnType<
  ReturnType<typeof createTrpcCreateContext>
>;
