import { createStore } from "solid-js/store";
import { DateTime } from "luxon";

export type ReceivedMessage = {
  receivedAt: DateTime;
  message: string;
};
export const [receivedMessages, setReceivedMessages] = createStore<
  ReceivedMessage[]
>([{ message: "hi there", receivedAt: DateTime.now() }]);

