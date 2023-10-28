import { observable, Observer } from "@trpc/server/observable";
import { z } from "zod";
import { loggedProcedure } from "../middlewares/middleware.js";
import { router } from "../trpc.js";
import { TRPCError } from "@trpc/server";
import { getEmojiMessageFor } from "./cloudflareWorkersAi.js";

// All messages sent to client start with "Observed"
type ObserverId = string;

const observedMessage = z.object({
  message: z.string(),
  emojiMessage: z.string().optional(),
});
type ObservedMessage = z.infer<typeof observedMessage>;

type MessageObserver = Observer<ObservedMessage, Error>;
const observersBySpeakerId = new Map<ObserverId, Set<MessageObserver>>();

export const messageRouter = router({
  sendMessageToSpeaker: loggedProcedure
    .input(z.object({ speakerUsername: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      let emojiMessage: string | undefined = undefined;
      try {
        emojiMessage = await getEmojiMessageFor(input.message);
      } catch (e) {
        console.error(e);
      }

      const observers = observersBySpeakerId.get(input.speakerUsername);
      if (!observers) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Speaker with username ${input.speakerUsername} was not found, cannot send message.`,
        });
      } else {
        observers.forEach((speaker) =>
          speaker.next({ message: input.message, emojiMessage }),
        );
      }
    }),
  subscribeMessages: loggedProcedure
    .input(z.object({ speakerUsername: z.string() }))
    .subscription(({ input }) =>
      observable<ObservedMessage, Error>((emit) => {
        let observers = observersBySpeakerId.get(input.speakerUsername);
        console.info(`Adding subscriber for ${input.speakerUsername}`);
        if (!observers) {
          observers = new Set();
          observersBySpeakerId.set(input.speakerUsername, observers);
        }
        observers.add(emit);
        return () => {
          console.info(`Removing subscriber for ${input.speakerUsername}`);
          observers?.delete(emit);
          if (observers?.size === 0) {
            observersBySpeakerId.delete(input.speakerUsername);
          }
        };
      }),
    ),
});
