import { createStore } from "solid-js/store";
import { DateTime } from "luxon";

export type ReceivedMessage = {
  receivedAt: DateTime;
  message: string;
  emojiMessage?: string;
};
export const [receivedMessages, setReceivedMessages] = createStore<
  ReceivedMessage[]
>([]);
// For testing: [{ message: "hi there", receivedAt: DateTime.now(), emojiMessage: "emoji" }]
