import { observable, Observer } from "@trpc/server/observable";
import { z } from "zod";
import { loggedProcedure } from "../middlewares/middleware";
import { router } from "../trpc";
import { TRPCError } from "@trpc/server";

// All messages sent to client start with "Observed"
type ObserverId = string;

const observedMessage = z.object({
  message: z.string(),
});
type ObservedMessage = z.infer<typeof observedMessage>;

type MessageObserver = Observer<ObservedMessage, Error>;
const observerBySpeakerId = new Map<ObserverId, MessageObserver>();

export const messageRouter = router({
  speaker: loggedProcedure
    .input(z.object({ speakerUsername: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      const observer = observerBySpeakerId.get(input.speakerUsername);
      if (!observer) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Speaker with username ${input.speakerUsername} was not found, cannot send message.`,
        });
      } else {
        observer.next({ message: input.message });
      }
    }),
  subscribeMessages: loggedProcedure
    .input(z.object({ speakerUsername: z.string() }))
    .subscription(({ input }) =>
      observable<ObservedMessage, Error>((emit) => {
        observerBySpeakerId.set(input.speakerUsername, emit);
        return () => {
          observerBySpeakerId.delete(input.speakerUsername);
        };
      }),
    ),
});
