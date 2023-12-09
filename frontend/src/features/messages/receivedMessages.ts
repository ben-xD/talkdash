import { createStore } from "solid-js/store";
import { DateTime } from "luxon";
import { Sender } from "@talkdash/schema";

export type ReceivedMessage = {
  receivedAt: DateTime;
  message: string;
  emojiMessage?: string;
  sender: Sender;
};
export const [receivedMessages, setReceivedMessages] = createStore<
  ReceivedMessage[]
>([]);
// For testing: [{ message: "hi there", receivedAt: DateTime.now(), emojiMessage: "emoji" }]
