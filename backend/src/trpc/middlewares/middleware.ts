import { procedure } from "../trpc.js";
import { trpcMetricsMiddleware } from "./trpcMetricsMiddleware.js";
import { trpcLogMiddleware } from "./trpcLogMiddleware.js";
import { trpcCorsMiddleware } from "./trpcCorsMiddleware.js";
import { trpcAuthMiddleware } from "../../auth/trpcAuthMiddleware.js";

export const publicProcedure = procedure
  .use(trpcMetricsMiddleware)
  .use(trpcCorsMiddleware);
export const loggedProcedure = publicProcedure.use(trpcLogMiddleware);
export const protectedProcedure = loggedProcedure.use(trpcAuthMiddleware);
// export const adminProcedure = loggedProcedure.use(adminAuthMiddleware);
