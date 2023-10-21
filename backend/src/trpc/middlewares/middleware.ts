import { procedure } from "../trpc";
import { metricsMiddleware } from "./metricsMiddleware";
import { logMiddleware } from "./logMiddleware";
import { corsMiddleware } from "./corsMiddleware";

export const publicProcedure = procedure
  .use(metricsMiddleware)
  .use(corsMiddleware);
export const loggedProcedure = publicProcedure.use(logMiddleware);
// export const protectedProcedure = loggedProcedure.use(authMiddleware);
// export const adminProcedure = loggedProcedure.use(adminAuthMiddleware);
