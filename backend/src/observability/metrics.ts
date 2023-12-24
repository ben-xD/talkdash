import client, { Metric } from "prom-client";
import { FastifyInstance } from "fastify";
import { metricsPath } from "../trpc/path.js";
import { env } from "../env.js";

const register = new client.Registry();
register.setDefaultLabels({ app: env.FLY_APP_NAME ?? "unknown" });
export const registerMetric = <T extends Metric>(metric: T): T => {
  register.registerMetric(metric);
  return metric;
};

export const setupPrometheusMetrics = (fastify: FastifyInstance) => {
  client.collectDefaultMetrics({ register });

  fastify.get(metricsPath, async (_request, reply) => {
    reply.header("Content-Type", register.contentType);
    return register.metrics();
  });
};
