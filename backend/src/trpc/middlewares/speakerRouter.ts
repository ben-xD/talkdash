import { z } from "zod";
import { loggedProcedure } from "./middleware.js";
import { router } from "../trpc.js";
import { observable, Observer } from "@trpc/server/observable";
import { getDurationInMinutesFrom } from "../messages/openAi.js";

const speakerEvent = z.discriminatedUnion("type", [
  z.object({ type: z.literal("speakerCreated"), speakerUsername: z.string() }),
  z.object({ type: z.literal("speakerDeleted"), speakerUsername: z.string() }),
]);
type SpeakerEvent = z.infer<typeof speakerEvent>;

type ObserverId = string;
type EventObserver = Observer<SpeakerEvent, Error>;
const observersBySpeakerUsername = new Map<ObserverId, Set<EventObserver>>();

export const speakerRouter = router({
  estimateDurationInMinutesOf: loggedProcedure
    .input(z.object({ durationDescription: z.string() }))
    .query(async ({ input }) => {
      // TODO rate limit this API.
      return getDurationInMinutesFrom(input.durationDescription);
    }),
  subscribeForSpeaker: loggedProcedure
    .input(z.object({ speakerUsername: z.string() }))
    .subscription(async ({ input }) =>
      observable<SpeakerEvent, Error>((emit) => {
        const { speakerUsername } = input;
        let observers = observersBySpeakerUsername.get(speakerUsername);
        if (!observers) {
          observers = new Set();
          observersBySpeakerUsername.set(speakerUsername, observers);
        }
        console.info(`Adding subscriber for ${speakerUsername} speaker events`);
        const speakerClientCount = countBySpeakerUsername.get(speakerUsername);
        if (speakerClientCount && speakerClientCount >= 1) {
          emit.next({
            type: "speakerCreated",
            speakerUsername,
          });
        }
        observers.add(emit);
        return () => {
          console.info(
            `Removing subscriber for ${speakerUsername} speaker events`,
          );
          observers?.delete(emit);
          if (observers?.size === 0) {
            observersBySpeakerUsername.delete(speakerUsername);
          }
        };
      }),
    ),
});

const countBySpeakerUsername = new Map<string, number>();

// TODO make it generic and share with messageRouter.
const emitToAll = (
  observers: Set<EventObserver> | undefined,
  event: SpeakerEvent,
) => {
  if (observers) {
    console.debug(
      `Sending event to speaker event observers: ${JSON.stringify(event)}`,
    );
    for (const observer of observers) {
      observer.next(event);
    }
  }
};

export const addSpeakerClient = (speakerUsername: string) => {
  let speakerCount = countBySpeakerUsername.get(speakerUsername);
  if (speakerCount === undefined || speakerCount === 0) {
    speakerCount = 1;
    emitToAll(observersBySpeakerUsername.get(speakerUsername), {
      type: "speakerCreated",
      speakerUsername: speakerUsername,
    });
  } else {
    speakerCount += 1;
  }
  countBySpeakerUsername.set(speakerUsername, speakerCount);
};

export const removeSpeakerClient = (speakerUsername: string) => {
  let speakerCount = countBySpeakerUsername.get(speakerUsername);
  if (speakerCount === undefined) {
    throw new Error(
      "Cannot remove speaker because it doesn't exist. This is a developer error.",
    );
  }
  speakerCount -= 1;
  countBySpeakerUsername.set(speakerUsername, speakerCount);
  if (speakerCount <= 0) {
    emitToAll(observersBySpeakerUsername.get(speakerUsername), {
      type: "speakerDeleted",
      speakerUsername: speakerUsername,
    });
  }
};
