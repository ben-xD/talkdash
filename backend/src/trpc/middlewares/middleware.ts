import { procedure } from "../trpc.js";
import { trpcMetricsMiddleware } from "./trpcMetricsMiddleware.js";
import { trpcLogMiddleware } from "./trpcLogMiddleware.js";
import { trpcCorsMiddleware } from "./trpcCorsMiddleware.js";
import {
  trpcAuthRequiredMiddleware,
  trpcAuthSessionMiddleware,
} from "../../auth/trpcAuthMiddleware.js";

const publicProcedure = procedure
  .use(trpcMetricsMiddleware)
  .use(trpcCorsMiddleware);
export const loggedProcedure = publicProcedure
  .use(trpcLogMiddleware)
  .use(trpcAuthSessionMiddleware);
export const protectedProcedure = loggedProcedure.use(
  trpcAuthRequiredMiddleware,
);
// export const adminProcedure = loggedProcedure.use(adminAuthMiddleware);
