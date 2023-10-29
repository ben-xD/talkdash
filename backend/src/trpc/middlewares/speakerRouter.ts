import { z } from "zod";
import { loggedProcedure } from "./middleware.js";
import { router } from "../trpc.js";
import { observable, Observer } from "@trpc/server/observable";
import { getDurationInMinutesFrom } from "../messages/openAi.js";
import { TRPCError } from "@trpc/server";
import {
  addSpeakerClient,
  emitToHosts,
  removeSpeakerClient,
} from "../messages/hostRouter.js";

// All messages sent to client start with "Observed"
type ObserverId = string;

// An event related to hosts. e.g. Host created message.
const hostEvent = z.object({
  message: z.string(),
  emojiMessage: z.string().optional(),
});
type HostEvent = z.infer<typeof hostEvent>;

type EventObserver = Observer<HostEvent, Error>;
const speakerByUsername = new Map<ObserverId, Set<EventObserver>>();

export const getSpeakersFor = (speakerUsername: string) => {
  let speakers = speakerByUsername.get(speakerUsername);
  if (speakers) return speakers;
  const newSpeakers = new Set<EventObserver>();
  speakerByUsername.set(speakerUsername, newSpeakers);
  return newSpeakers;
};

export const emitToSpeakers = (speakerUsername: string, event: HostEvent) => {
  const speakers = speakerByUsername.get(speakerUsername);
  if (!speakers) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Speaker with username ${speakerUsername} was not found, cannot send message.`,
    });
  } else {
    speakers.forEach((speaker) => speaker.next(event));
  }
};

type SpeakerTimes = { start: number | undefined; finish: number | undefined };
const timesBySpeakerId = new Map<string, SpeakerTimes>();

export const getTimesFor = (speakerUsername: string) => {
  return timesBySpeakerId.get(speakerUsername);
};

export const speakerRouter = router({
  subscribeMessagesAsSpeaker: loggedProcedure
    .input(z.object({ speakerUsername: z.string() }))
    .subscription(({ input }) =>
      observable<HostEvent, Error>((emit) => {
        addSpeakerClient(input.speakerUsername);
        const speakers = getSpeakersFor(input.speakerUsername);
        console.info(`Adding speaker client for ${input.speakerUsername}`);
        speakers.add(emit);
        return () => {
          removeSpeakerClient(input.speakerUsername);
          console.info(`Removing speaker client for ${input.speakerUsername}`);
          speakers?.delete(emit);
        };
      }),
    ),
  updateTimes: loggedProcedure
    .input(
      z.object({
        speakerUsername: z.string(),
        start: z.number().optional(),
        finish: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { speakerUsername, start, finish } = input;
      console.debug(`Updating times for ${speakerUsername}`, { start, finish });
      timesBySpeakerId.set(speakerUsername, { start, finish });
      emitToHosts(speakerUsername, {
        type: "speakerTimesUpdated",
        speakerUsername,
        start,
        finish,
      });
    }),
  estimateDurationInMinutesOf: loggedProcedure
    .input(z.object({ durationDescription: z.string() }))
    .query(async ({ input }) => {
      // TODO rate limit this API.
      return getDurationInMinutesFrom(input.durationDescription);
    }),
});
