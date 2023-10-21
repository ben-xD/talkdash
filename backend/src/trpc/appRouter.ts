import { z } from "zod";
import { router } from "./trpc";
import { loggedProcedure } from "./middlewares/middleware";
import { messageRouter } from "./messages/messageRouter";

// Warning: any empty routers will cause trpc panel to fail to load in the browser.
export const appRouter = router({
  health: loggedProcedure.input(z.object({})).query(() => "ok 👍"),
  message: messageRouter,
});

export type AppRouter = typeof appRouter;
