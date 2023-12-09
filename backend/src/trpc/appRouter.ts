import { z } from "zod";
import { router } from "./trpc.js";
import { loggedProcedure } from "./middlewares/middleware.js";
import { senderRouter } from "../features/messages/senderRouter.js";
import { speakerRouter } from "./middlewares/speakerRouter.js";
import { authRouter } from "../auth/authRouter.js";

// Warning: any empty routers will cause trpc panel to fail to load in the browser.
export const appRouter = router({
  // Empty input because trpc panel won't show it otherwise.
  health: loggedProcedure.input(z.object({})).query(() => "ok 👻"),
  auth: authRouter,
  // Hosts and audience are senders
  sender: senderRouter,
  speaker: speakerRouter,
});

export type AppRouter = typeof appRouter;
