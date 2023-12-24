import Fastify from "fastify";
import chalk from "chalk";
import {
  metricsPath,
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
import { setupPrometheusMetrics } from "./observability/metrics.js";

const fastify = Fastify({
  maxParamLength: 5000,
  logger: env.LOG_FASTIFY,
});

// Separate fastify instance for metrics to keep metrics on separate port, and internal to Fly.io
const metricsFastify = Fastify({
  maxParamLength: 5000,
  logger: env.LOG_FASTIFY,
});

setupPrometheusMetrics(metricsFastify);

registerTrpcPanel(fastify);
const { dbPool, db } = await connectToDb();
const auth = createAuth(dbPool);
const oAuths = createOAuths(auth);
registerTrpcApis(fastify, db, auth, oAuths);

const address = env.INSIDE_DOCKER ? "0.0.0.0" : "127.0.0.1";
const port = env.PORT ? parseInt(env.PORT, 10) : 4000;
const metricsPort = 9091;

try {
  await fastify.listen({ port, host: address });
  await metricsFastify.listen({ port: metricsPort, host: address });
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
  console.info(
    chalk.green(`Metrics on http://${address}:${metricsPort}${metricsPath}`),
  );
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
