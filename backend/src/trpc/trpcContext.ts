import { inferAsyncReturnType } from "@trpc/server";

import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { Database } from "../db/db.js";

export const createTrpcCreateContext =
  (db: Database) =>
  async ({ req, res }: CreateFastifyContextOptions) => {
    return {
      req,
      res,
      db,
    };
  };

export type TrpcContext = inferAsyncReturnType<
  ReturnType<typeof createTrpcCreateContext>
>;
