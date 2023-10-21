import { observable, Observer } from "@trpc/server/observable";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { loggedProcedure } from "../middlewares/middleware";
import { router } from "../trpc";

// All messages sent to client start with "Observed"
type ObserverId = string;

const observedMessage = z.object({
  message: z.string(),
});
type ObservedMessage = z.infer<typeof observedMessage>;

type MessageObserver = Observer<ObservedMessage, Error>;
const observerById = new Map<ObserverId, MessageObserver>();

export const messageRouter = router({
  subscribeMessages: loggedProcedure.subscription(() =>
    observable<ObservedMessage, Error>((emit) => {
      const observerId = uuidv4();
      observerById.set(observerId, emit);
      return () => {
        console.info("Unsubscribe called?");
      };
    }),
  ),
});
