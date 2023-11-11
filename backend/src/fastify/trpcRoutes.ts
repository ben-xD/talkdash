import fastifyWebsocket from "@fastify/websocket";
import {
  trpcHttpApiPath,
  trpcPanelPath,
  trpcWebsocketApiPath,
} from "../trpc/path.js";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter } from "../trpc/appRouter.js";
import { createContext } from "../trpc/context.js";
import Fastify, { FastifyInstance } from "fastify";
import { renderTrpcPanel } from "trpc-panel";

export function registerTrpcApis(fastify: FastifyInstance) {
  // Websocket server
  fastify.register(fastifyWebsocket, { prefix: trpcWebsocketApiPath });

  // HTTP API
  fastify.register(fastifyTRPCPlugin, {
    prefix: trpcHttpApiPath,
    // The fastify TRPC plugin's trpc options is not typed.
    // type TrpcOptions = Parameters<typeof initTRPC.create>[0] & {router: Router<any>};
    trpcOptions: {
      router: appRouter,
      createContext,
    },
  });

  // Websocket API
  fastify.register(fastifyTRPCPlugin, {
    prefix: trpcWebsocketApiPath,
    useWSS: true,
    trpcOptions: {
      router: appRouter,
      createContext,
    },
  });
}

export function registerTrpcPanel(fastify: FastifyInstance) {
  const trpcPanelApp = renderTrpcPanel(appRouter, { url: trpcHttpApiPath });
  // trpc panels uses the HTTP API, not websocket.
  fastify.get(trpcPanelPath, (_request, reply) => {
    reply.header("Content-Type", "text/html").send(trpcPanelApp);
  });
}
