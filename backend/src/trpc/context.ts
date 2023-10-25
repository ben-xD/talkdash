import { inferAsyncReturnType } from "@trpc/server";

import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

// Not currently using database.
// const dbPromise = connectToDb();

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  // const db = await dbPromise;
  // TODO auth / check headers

  return {
    req,
    res,
    // db,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;
