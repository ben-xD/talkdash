import Fastify, { FastifyInstance } from "fastify";
import chalk from "chalk";
import {
  trpcHttpApiPath,
  trpcPanelPath,
  trpcWebsocketApiPath,
} from "./trpc/path.js";
import { enableFastityLogging, env } from "./env.js";
import { registerTrpcApis, registerTrpcPanel } from "./fastify/trpcRoutes.js";
import { createAuthJsConfig } from "./auth/auth.js";
import { Auth } from "@auth/core";

const fastify = Fastify({
  maxParamLength: 5000,
  logger: enableFastityLogging,
});

registerTrpcPanel(fastify);
registerTrpcApis(fastify);

(async () => {
  try {
    const address = env.INSIDE_DOCKER ? "0.0.0.0" : "127.0.0.1";
    const port = env.PORT ? parseInt(env.PORT, 10) : 4000;
    await fastify.listen({ port, host: address });
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
