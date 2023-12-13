import { observable, Observer } from "@trpc/server/observable";
import { z } from "zod";
import { loggedProcedure } from "../../trpc/middlewares/middleware.js";
import { router } from "../../trpc/trpc.js";
import {
  emitToSpeakers,
  getSpeakersFor,
  getTimesFor,
} from "../../trpc/middlewares/speakerRouter.js";
import { emitToAll } from "../../trpc/observers.js";
import { role, Sender } from "@talkdash/schema";
import { getEmojiMessageFor } from "./openAi.js";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { Context } from "node:vm";
import { userTable } from "../../db/schema/index.js";

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
const sendersBySpeakerUsername = new Map<ObserverId, Set<EventObserver>>();

const getSendersFor = (speakerUsername: string) => {
  const senders = sendersBySpeakerUsername.get(speakerUsername);
  if (senders) return senders;
  const newSenders = new Set<EventObserver>();
  sendersBySpeakerUsername.set(speakerUsername, newSenders);
  return newSenders;
};

export const emitToSenders = (speakerUsername: string, event: SpeakerEvent) => {
  const senders = getSendersFor(speakerUsername);
  emitToAll(senders, event);
};

async function ensurePinMatchesIfExists(
  ctx: Context,
  speakerUsername: string,
  hostPin: string | undefined,
) {
  // check if the speaker has a pin, and if so, the pin matches
  const [speaker] = await ctx.db
    .select()
    .from(userTable)
    .where(eq(userTable.username, speakerUsername));
  if (speaker && speaker.pin && speaker.pin !== hostPin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Host pin is incorrect.",
    });
  }
}

export const senderRouter = router({
  sendMessageToSpeaker: loggedProcedure
    .input(
      z.object({
        speakerUsername: z.string(),
        message: z.string(),
        role: role,
        hostPin: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { role, speakerUsername } = input;
      const userId = ctx.connectionContext.session?.user?.userId;
      const user = userId ? await ctx.auth.getUser(userId) : undefined;
      const senderUsername =
        user?.username ?? ctx.connectionContext?.temporaryUsername;

      if (role === "host") {
        await ensurePinMatchesIfExists(ctx, speakerUsername, input.hostPin);
      }

      const sender: Sender = {
        role,
        username: senderUsername,
      };
      try {
        const emojiMessage = await getEmojiMessageFor(input.message);
        // const [editedMessage, emojiMessage] = await Promise.all([
        //   editMessageIfDangerous(input.message),
        //   getEmojiMessageFor(input.message),
        // ]);
        emitToSpeakers(input.speakerUsername, {
          message: input.message,
          emojiMessage,
          sender,
        });
      } catch (e) {
        console.error(
          "Emitting original message without emoji because an API call went wrong.",
          e,
        );
        emitToSpeakers(input.speakerUsername, {
          message: input.message,
          sender,
        });
        console.error(e);
      }
    }),
  subscribeForSpeakerEvents: loggedProcedure
    .input(z.object({ speakerUsername: z.string() }))
    .subscription(async ({ input }) =>
      observable<SpeakerEvent, Error>((emit) => {
        const { speakerUsername } = input;
        const speakers = getSpeakersFor(speakerUsername);
        const sender = getSendersFor(speakerUsername);
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
        sender.add(emit);
        return () => {
          console.info(
            `Removing subscriber for ${speakerUsername} speaker events`,
          );
          sender?.delete(emit);
        };
      }),
    ),
});

const countBySpeakerUsername = new Map<string, number>();

export const addSpeakerClient = (speakerUsername: string) => {
  let speakerCount = countBySpeakerUsername.get(speakerUsername);
  if (speakerCount === undefined || speakerCount === 0) {
    speakerCount = 1;
    emitToAll(sendersBySpeakerUsername.get(speakerUsername), {
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
    emitToAll(sendersBySpeakerUsername.get(speakerUsername), {
      type: "speakerDeleted",
      speakerUsername: speakerUsername,
    });
  }
};
