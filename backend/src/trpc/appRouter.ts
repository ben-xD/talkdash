import { z } from "zod";
import { router } from "./trpc.js";
import { loggedProcedure } from "./middlewares/middleware.js";
import { hostRouter } from "./messages/hostRouter.js";
import { speakerRouter } from "./middlewares/speakerRouter.js";

// Warning: any empty routers will cause trpc panel to fail to load in the browser.
export const appRouter = router({
  health: loggedProcedure.input(z.object({})).query(() => "ok 👍"),
  host: hostRouter,
  speaker: speakerRouter,
});

export type AppRouter = typeof appRouter;
