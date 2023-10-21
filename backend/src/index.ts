import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import Fastify from "fastify";
import ws from "@fastify/websocket";
import chalk from "chalk";
import { renderTrpcPanel } from "trpc-panel";
import { createContext } from "./trpc/context";
import {
  trpcHttpApiPath,
  trpcPanelPath,
  trpcWebsocketApiPath,
} from "./trpc/trpcPath";
import { appRouter } from "./trpc/appRouter";

const fastify = Fastify({
  maxParamLength: 5000,
  logger: true,
});

// trpc panels uses the HTTP API, not websocket.
const trpcPanelApp = renderTrpcPanel(appRouter, { url: trpcHttpApiPath });

// The fastify TRPC plugin's trpc options is not typed.
// type TrpcOptions = Parameters<typeof initTRPC.create>[0] & {router: Router<any>};

// TODO refactor to separate router instead of the server file.
fastify.get(trpcPanelPath, (request, reply) => {
  reply.header("Content-Type", "text/html").send(trpcPanelApp);
});

fastify.register(fastifyTRPCPlugin, {
  prefix: trpcHttpApiPath,
  trpcOptions: {
    router: appRouter,
    createContext,
  },
});

// TODO useWSS: true
fastify.register(ws, { prefix: trpcWebsocketApiPath });

(async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
    await fastify.listen({ port });
    console.info(
      chalk.green(
        `tRPC HTTP API on http://localhost:${port}${trpcHttpApiPath}`,
      ),
    );
    console.info(
      chalk.green(
        `tRPC WebSocket API on http://localhost:${port}${trpcWebsocketApiPath}`,
      ),
    );
    console.info(
      chalk.green(
        `API UI (tRPC Panel) on http://localhost:${port}${trpcPanelPath}`,
      ),
    );
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
