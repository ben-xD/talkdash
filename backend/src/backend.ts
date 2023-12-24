import Fastify from "fastify";
import chalk from "chalk";
import {
  trpcHttpApiPath,
  trpcPanelPath,
  trpcWebsocketApiPath,
} from "./trpc/path.js";
import { env } from "./env.js";
import {
  registerTrpcApis,
  registerTrpcPanel,
} from "./trpc/fastifyTrpcRoutes.js";
import { connectToDb } from "./db/db.js";
import { createAuth, createOAuths } from "./auth/auth.js";

const fastify = Fastify({
  maxParamLength: 5000,
  logger: env.LOG_FASTIFY,
});

registerTrpcPanel(fastify);
const { dbPool, db } = await connectToDb();
const auth = createAuth(dbPool);
const oAuths = createOAuths(auth);
registerTrpcApis(fastify, db, auth, oAuths);

const address = env.INSIDE_DOCKER ? "0.0.0.0" : "127.0.0.1";
const port = env.PORT ? parseInt(env.PORT, 10) : 4000;

try {
  await fastify.listen({ port, host: address });
  console.info(
    chalk.green(`tRPC HTTP API on http://${address}:${port}${trpcHttpApiPath}`),
  );
  console.info(
    chalk.green(
      `tRPC WebSocket API on http://${address}:${port}${trpcWebsocketApiPath}`,
    ),
  );
  console.info(
    chalk.green(
      `API UI (tRPC Panel) on http://${address}:${port}${trpcPanelPath}`,
    ),
  );
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
