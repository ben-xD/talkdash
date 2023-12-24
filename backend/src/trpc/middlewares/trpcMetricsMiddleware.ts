import { middleware } from "../trpc.js";
import client from "prom-client";
import { registerMetric } from "../../observability/metrics.js";

const trpcRequestDurationSeconds = registerMetric(
  new client.Histogram({
    name: "trpc_request_duration_seconds",
    help: "Duration of tRPC requests in seconds",
    labelNames: ["path", "type", "ok", "clientProtocol"],
    buckets: [0.05, 0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
  }),
);

export const trpcMetricsMiddleware = middleware(
  async ({ ctx, path, type, next }) => {
    const end = trpcRequestDurationSeconds.startTimer();
    const result = await next({ ctx });
    end({
      path,
      type,
      ok: result.ok ? 1 : 0,
      clientProtocol: ctx.clientProtocol,
    });
    return result;
  },
);
