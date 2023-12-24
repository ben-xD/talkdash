import { z } from "zod";

export const role = z.union([
  z.literal("host"),
  z.literal("audience"),
  z.literal("speaker"),
  z.literal("bot"),
]);
export type Role = z.infer<typeof role>;

export const sender = z.object({
  role: role.optional(),
  username: z.string().optional(),
});
export type Sender = z.infer<typeof sender>;

// An event related to hosts. e.g. Host created message.
export const senderEvent = z.object({
  message: z.string(),
  emojiMessage: z.string().optional(),
  sender,
});
export type SenderEvent = z.infer<typeof senderEvent>;

export const userRole = z.union([
  z.literal("host"),
  z.literal("audience"),
  z.literal("speaker"),
]);
export type UserRole = z.infer<typeof userRole>;
