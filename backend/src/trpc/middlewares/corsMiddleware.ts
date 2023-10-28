import { middleware } from "../trpc.js";

export const corsMiddleware = middleware(async ({ ctx, next }) =>
  // TODO check what the arguments are when using fastify trpc integration

  // TODO only allow allowlisted domains in production

  // Set the Access-Control-Allow-Origin header to allow all localhost servers
  // const { origin } = new URL(ctx.req.url);
  // ACAO res header doesn't support multiple origins. So in development we let any request through.
  // ctx.resHeaders.set('Access-Control-Allow-Origin', origin);
  // ctx.resHeaders.set("Access-Control-Allow-Origin", "*");

  // ctx.resHeaders.set('Access-Control-Allow-Origin', 'http://localhost:*');
  // console.info(origin);
  // console.info((ctx.req.url as URL).origin)
  next({
    ctx,
  }),
);
