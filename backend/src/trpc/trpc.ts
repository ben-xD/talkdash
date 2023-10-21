import { initTRPC } from "@trpc/server";
import { Context } from "./context";

// Inspired by https://invertase.io/blog/astro-trpc-v10/ and https://trpc.io/docs/fetch
const t = initTRPC.context<Context>().create({
  // Don't use superjson, since fastify already parses objects.
  // TODO: Does fastify use superjson, or is it less powerful? (i.e. no datetime or nested objects serde)
  // transformer: superjson,
  errorFormatter: (opts) => {
    console.error(opts.error);
    return opts.shape;
  },
});

export const { procedure } = t;
export const { router } = t;
export const { middleware } = t;
