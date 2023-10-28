import { procedure } from "../trpc.js";
import { metricsMiddleware } from "./metricsMiddleware.js";
import { logMiddleware } from "./logMiddleware.js";
import { corsMiddleware } from "./corsMiddleware.js";

export const publicProcedure = procedure
  .use(metricsMiddleware)
  .use(corsMiddleware);
export const loggedProcedure = publicProcedure.use(logMiddleware);
// export const protectedProcedure = loggedProcedure.use(authMiddleware);
// export const adminProcedure = loggedProcedure.use(adminAuthMiddleware);
