import { z } from "zod";
import { loggedProcedure, protectedProcedure } from "./middleware.js";
import { SenderEvent } from "@talkdash/schema";
import { router } from "../trpc.js";
import { observable, Observer } from "@trpc/server/observable";
import { getDurationInMinutesFrom } from "../../features/messages/openAi.js";
import { TRPCError } from "@trpc/server";
import {
  addSpeakerClient,
  emitToSenders,
  removeSpeakerClient,
} from "../../features/messages/senderRouter.js";
import { eq } from "drizzle-orm";
import { assertAuth } from "../assert.js";
import { userTable } from "../../db/schema/index.js";

// All messages sent to client start with "Observed"
type ObserverId = string;

type EventObserver = Observer<SenderEvent, Error>;
const speakerByUsername = new Map<ObserverId, Set<EventObserver>>();

export const getSpeakersFor = (speakerUsername: string) => {
  const speakers = speakerByUsername.get(speakerUsername);
  if (speakers) return speakers;
  const newSpeakers = new Set<EventObserver>();
  speakerByUsername.set(speakerUsername, newSpeakers);
  return newSpeakers;
};

export const emitToSpeakers = (speakerUsername: string, event: SenderEvent) => {
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

export const getTimesFor = (
  speakerUsername: string,
): SpeakerTimes | undefined => {
  return timesBySpeakerId.get(speakerUsername);
};

// TODO don't get the speakerUsername from the input, get it from the session (only for authed users though)
export const speakerRouter = router({
  subscribeMessagesAsSpeaker: loggedProcedure
    .input(z.object({ speakerUsername: z.string() }))
    .subscription(({ input }) =>
      observable<SenderEvent, Error>((emit) => {
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
  getTimeState: loggedProcedure
    .input(z.object({ speakerUsername: z.string() }))
    .query(async ({ input }) => {
      const { speakerUsername } = input;
      return getTimesFor(speakerUsername);
    }),
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
      emitToSenders(speakerUsername, {
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
  setHostPin: protectedProcedure
    .input(z.object({ pin: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.connectionContext.session?.user?.userId;
      assertAuth("userId", userId);
      const [user] = await ctx.db
        .update(userTable)
        .set({ pin: input.pin ?? null })
        .where(eq(userTable.id, userId))
        .returning();
      const speakerUsername =
        user?.username ?? ctx.connectionContext.temporaryUsername;
      if (!speakerUsername) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `User was not found but was authenticated.`,
        });
      }
      emitToSenders(speakerUsername, {
        type: input.pin ? "pinRequired" : "pinNotRequired",
        speakerUsername,
      });
    }),
});
