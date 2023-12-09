import { z } from "zod";

export const senderRole = z.union([z.literal("host"), z.literal("audience")]);
export type SenderRole = z.infer<typeof senderRole>;

export const sender = z.object({
  role: senderRole.optional(),
  username: z.string().optional(),
});
export type Sender = z.infer<typeof sender>;

// An event related to hosts. e.g. Host created message.
export const hostEvent = z.object({
  message: z.string(),
  emojiMessage: z.string().optional(),
  sender,
});
export type HostEvent = z.infer<typeof hostEvent>;

export const userRole = z.union([
  z.literal("host"),
  z.literal("audience"),
  z.literal("speaker"),
]);
export type UserRole = z.infer<typeof userRole>;
