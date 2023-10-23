import {fastifyTRPCPlugin} from "@trpc/server/adapters/fastify";
import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import chalk from "chalk";
import {renderTrpcPanel} from "trpc-panel";
import {createContext} from "./trpc/context";
import {trpcHttpApiPath, trpcPanelPath, trpcWebsocketApiPath,} from "./trpc/trpcPath";
import {appRouter} from "./trpc/appRouter";

const fastify = Fastify({
  maxParamLength: 5000,
  logger: true,
});

function registerTrpcPanel() {
  const trpcPanelApp = renderTrpcPanel(appRouter, {url: trpcHttpApiPath});
  // trpc panels uses the HTTP API, not websocket.
  fastify.get(trpcPanelPath, (_request, reply) => {
    reply.header("Content-Type", "text/html").send(trpcPanelApp);
  });
}

function registerTrpcApis() {
// Websocket server
  fastify.register(fastifyWebsocket, {prefix: trpcWebsocketApiPath});

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

registerTrpcPanel();
registerTrpcApis();

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
