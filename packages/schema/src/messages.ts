import { z } from "zod";

export const sender = z.object({
  role: z.union([z.literal("host"), z.literal("audience")]),
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
