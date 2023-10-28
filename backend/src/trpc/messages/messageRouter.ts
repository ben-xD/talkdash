import { observable, Observer } from "@trpc/server/observable";
import { z } from "zod";
import { loggedProcedure } from "../middlewares/middleware.js";
import { router } from "../trpc.js";
import { TRPCError } from "@trpc/server";
import { getEmojiMessageFor } from "./cloudflareWorkersAi.js";
import {
  addSpeakerClient,
  removeSpeakerClient,
} from "../middlewares/speakerRouter.js";

// All messages sent to client start with "Observed"
type ObserverId = string;

const observedMessage = z.object({
  message: z.string(),
  emojiMessage: z.string().optional(),
});
type MessageEvent = z.infer<typeof observedMessage>;

type EventObserver = Observer<MessageEvent, Error>;
const observersBySpeakerUsername = new Map<ObserverId, Set<EventObserver>>();

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

      const observers = observersBySpeakerUsername.get(input.speakerUsername);
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
  subscribeMessagesAsSpeaker: loggedProcedure
    .input(z.object({ speakerUsername: z.string() }))
    .subscription(({ input }) =>
      observable<MessageEvent, Error>((emit) => {
        addSpeakerClient(input.speakerUsername);
        let observers = observersBySpeakerUsername.get(input.speakerUsername);
        console.info(`Adding speaker client for ${input.speakerUsername}`);
        if (!observers) {
          observers = new Set();
          observersBySpeakerUsername.set(input.speakerUsername, observers);
        }
        observers.add(emit);
        return () => {
          removeSpeakerClient(input.speakerUsername);
          console.info(`Removing speaker client for ${input.speakerUsername}`);
          observers?.delete(emit);
          if (observers?.size === 0) {
            observersBySpeakerUsername.delete(input.speakerUsername);
          }
        };
      }),
    ),
});
