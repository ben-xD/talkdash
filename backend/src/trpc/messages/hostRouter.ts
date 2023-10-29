import { observable, Observer } from "@trpc/server/observable";
import { z } from "zod";
import { loggedProcedure } from "../middlewares/middleware.js";
import { router } from "../trpc.js";
import { getEmojiMessageFor } from "./cloudflareWorkersAi.js";
import {
  emitToSpeakers,
  getSpeakersFor,
  getTimesFor,
} from "../middlewares/speakerRouter.js";
import { emitToAll } from "../observers.js";

// An event related to speakers
const speakerEvent = z.discriminatedUnion("type", [
  z.object({ type: z.literal("speakerCreated"), speakerUsername: z.string() }),
  z.object({ type: z.literal("speakerDeleted"), speakerUsername: z.string() }),
  z.object({
    type: z.literal("speakerTimesUpdated"),
    speakerUsername: z.string(),
    start: z.number().optional(),
    finish: z.number().optional(),
  }),
]);
type SpeakerEvent = z.infer<typeof speakerEvent>;

type ObserverId = string;
type EventObserver = Observer<SpeakerEvent, Error>;
const hostBySpeakerUsername = new Map<ObserverId, Set<EventObserver>>();

const getHostsFor = (speakerUsername: string) => {
  const hosts = hostBySpeakerUsername.get(speakerUsername);
  if (hosts) return hosts;
  const newHosts = new Set<EventObserver>();
  hostBySpeakerUsername.set(speakerUsername, newHosts);
  return newHosts;
};

export const emitToHosts = (speakerUsername: string, event: SpeakerEvent) => {
  const hosts = getHostsFor(speakerUsername);
  emitToAll(hosts, event);
};

export const hostRouter = router({
  sendMessageToSpeaker: loggedProcedure
    .input(z.object({ speakerUsername: z.string(), message: z.string() }))
    .mutation(async ({ input }) => {
      let emojiMessage: string | undefined = undefined;
      try {
        emojiMessage = await getEmojiMessageFor(input.message);
      } catch (e) {
        console.error(e);
      }
      emitToSpeakers(input.speakerUsername, {
        message: input.message,
        emojiMessage,
      });
    }),
  subscribeForSpeakerEvents: loggedProcedure
    .input(z.object({ speakerUsername: z.string() }))
    .subscription(async ({ input }) =>
      observable<SpeakerEvent, Error>((emit) => {
        const { speakerUsername } = input;
        const speakers = getSpeakersFor(speakerUsername);
        const hosts = getHostsFor(speakerUsername);
        if (speakers && speakers.size >= 1) {
          emit.next({
            type: "speakerCreated",
            speakerUsername,
          });
          const times = getTimesFor(speakerUsername);
          if (times) {
            const { start, finish } = times;
            emit.next({
              speakerUsername,
              type: "speakerTimesUpdated",
              start,
              finish,
            });
          }
        }
        console.info(`Adding subscriber for ${speakerUsername} speaker events`);
        hosts.add(emit);
        return () => {
          console.info(
            `Removing subscriber for ${speakerUsername} speaker events`,
          );
          hosts?.delete(emit);
        };
      }),
    ),
});

const countBySpeakerUsername = new Map<string, number>();

export const addSpeakerClient = (speakerUsername: string) => {
  let speakerCount = countBySpeakerUsername.get(speakerUsername);
  if (speakerCount === undefined || speakerCount === 0) {
    speakerCount = 1;
    emitToAll(hostBySpeakerUsername.get(speakerUsername), {
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
    emitToAll(hostBySpeakerUsername.get(speakerUsername), {
      type: "speakerDeleted",
      speakerUsername: speakerUsername,
    });
  }
};
