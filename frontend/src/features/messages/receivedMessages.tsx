import { createStore } from "solid-js/store";
import { DateTime } from "luxon";
import { Sender } from "@talkdash/schema";
import { toast } from "solid-toast";

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

export const addMessage = ({
  message,
  emojiMessage,
  sender,
}: Omit<ReceivedMessage, "receivedAt">) => {
  const receivedAt = DateTime.now();
  console.info(
    `Received message at ${receivedAt}:\n${message} from ${sender.username}`,
  );
  toast(() => <p class="text-secondary-800">Message received</p>);
  setReceivedMessages([
    { receivedAt, message, emojiMessage, sender },
    ...receivedMessages,
  ]);
};
