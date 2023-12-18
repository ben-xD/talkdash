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
import { assertAuth, assertWebsocketClient } from "../assert.js";
import { userTable } from "../../db/schema/index.js";
import { TrpcContext } from "../trpcContext.js";
import { authenticateWebsocketConnection } from "../../auth/authRouter.js";

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

// Prefer the temporary username, then the registered username.
const getPreferredUsername = async (ctx: TrpcContext): Promise<string> => {
  assertWebsocketClient(ctx.clientProtocol);
  let username = ctx.connectionContext.temporaryUsername;
  if (username) return username;
  const userId = ctx.connectionContext.session?.user?.userId;
  if (userId) {
    const [user] = await ctx.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, userId));
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User was not found.",
      });
    }
    if (!user.username) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User did not have temporary username or registered username.",
      });
    }
    return user.username;
  }
  throw new TRPCError({
    code: "NOT_FOUND",
    message: "User did not have temporary username or registered username. X",
  });
};

type SpeakerTimes = { start: number | undefined; finish: number | undefined };
const timesBySpeakerId = new Map<string, SpeakerTimes>();

export const getTimesFor = (
  speakerUsername: string,
): SpeakerTimes | undefined => {
  return timesBySpeakerId.get(speakerUsername);
};

export const speakerRouter = router({
  subscribeMessagesAsSpeaker: loggedProcedure
    // Optional, because the speaker might not be registered
    .input(z.object({ authToken: z.string().optional() }))
    .subscription(async ({ ctx, input }) => {
      // This procedure is called when the subscriber reconnects too.
      // In this case, they won't have a connection context, and so we have no idea who they are.
      // Therefore, we require the user to provide a authToken input.
      if (input.authToken) {
        await authenticateWebsocketConnection(ctx, input.authToken);
      }

      const username = await getPreferredUsername(ctx);
      if (username) {
        return observable<SenderEvent, Error>((emit) => {
          addSpeakerClient(username);
          const speakers = getSpeakersFor(username);
          console.info(`Adding speaker client for ${username}`);
          speakers.add(emit);
          return () => {
            removeSpeakerClient(username);
            console.info(`Removing speaker client for ${username}`);
            speakers?.delete(emit);
          };
        });
      } else {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "No username was found for user, cannot subscribe to their messages.",
        });
      }
    }),
  getTimeState: loggedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const username = await getPreferredUsername(ctx);
    return getTimesFor(username);
  }),
  updateTimes: loggedProcedure
    .input(
      z.object({
        start: z.number().optional(),
        finish: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const speakerUsername = await getPreferredUsername(ctx);
      const { start, finish } = input;
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
  getPin: protectedProcedure
    .input(z.object({}))
    .output(
      z.object({
        pin: z.string().optional(),
        isRequired: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx }) => {
      assertWebsocketClient(ctx.clientProtocol);
      const userId = ctx.connectionContext.session?.user?.userId;
      assertAuth("userId", userId);
      const [user] = await ctx.db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId));
      return {
        pin: user?.pin ?? undefined,
        isRequired: user?.isPinRequired ?? undefined,
      };
    }),
  setPin: protectedProcedure
    .input(
      z.object({
        pin: z.string().optional().nullable(),
        isRequired: z.boolean().optional().nullable(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      assertWebsocketClient(ctx.clientProtocol);
      const userId = ctx.connectionContext.session?.user?.userId;
      assertAuth("userId", userId);
      const [user] = await ctx.db
        .update(userTable)
        .set({ pin: input.pin, isPinRequired: input.isRequired })
        .where(eq(userTable.id, userId))
        .returning();
      const isRequired = input.isRequired ?? user?.isPinRequired;
      const speakerUsername =
        user?.username ?? ctx.connectionContext.temporaryUsername;
      if (!speakerUsername) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `User was not found but was authenticated.`,
        });
      }
      emitToSenders(speakerUsername, {
        type: isRequired ? "pinRequired" : "pinNotRequired",
        speakerUsername,
      });
    }),
});
