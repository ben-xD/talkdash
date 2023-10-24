import { MetadataView } from "../features/speaker/MetadataView.tsx";
import { ConfigCard } from "../features/ConfigCard.tsx";
import { TimeLeftDisplay } from "../features/time/TimeLeftDisplay.tsx";
import { MessageView } from "../features/messages/MessageView.tsx";
import { onCleanup, onMount } from "solid-js";
import { loadQueryParams } from "./loadQueryParams.ts";
import { speakerUsername } from "../features/user/userState.ts";
import { Unsubscribable } from "@trpc/server/observable";
import { trpc } from "../client/trpc.ts";
import {
  receivedMessages,
  setReceivedMessages,
} from "../features/messages/receivedMessages.ts";
import { DateTime } from "luxon";

const minimumMessageDisplayTimeInMs = 7000;

const removeOldestMessageAfterExpiry = (currentTime: DateTime) => {
  // Remove oldest message if it's been displayed for a while and there's another message waiting.
  const oldestMessageReceivedAt = receivedMessages[0]?.receivedAt;
  if (
    oldestMessageReceivedAt &&
    currentTime.diff(oldestMessageReceivedAt).milliseconds >
      minimumMessageDisplayTimeInMs
  ) {
    setTimeout(() => {
      if (receivedMessages.length > 1) {
        console.info(
          `Removing the oldest message (${receivedMessages[0]}) after expiry ${minimumMessageDisplayTimeInMs}.`,
        );
        setReceivedMessages([...receivedMessages.slice(1)]);
      }
      // Remove more if there's more than 1.
      removeOldestMessageAfterExpiry(DateTime.now());
    }, minimumMessageDisplayTimeInMs);
  }
};

const Speaker = () => {
  let messageSubscription: Unsubscribable | undefined = undefined;

  onMount(() => {
    document.title = "Speaker · Talkdash";
    loadQueryParams();
    const username = speakerUsername();
    if (username) {
      messageSubscription = trpc.message.subscribeMessages.subscribe(
        { speakerUsername: username },
        {
          onData: ({ message }) => {
            const receivedAt = DateTime.now();
            console.info(`Received message: ${message} at ${receivedAt}`);
            removeOldestMessageAfterExpiry(receivedAt);
            setReceivedMessages([...receivedMessages, { receivedAt, message }]);
          },
        },
      );
    }
  });

  onCleanup(() => {
    console.info("Unsubscribing from speaker messages");
    messageSubscription?.unsubscribe();
  });

  return (
    <div class="flex flex-col items-center">
      <div class="max-w-[400px] w-full flex flex-col items-stretch">
        <MetadataView />
        <div class="py-4 my-2 bg-blue-50 p-4 rounded-xl">
          <ConfigCard />
        </div>
      </div>
      <div class="my-2 flex justify-center">
        <TimeLeftDisplay />
      </div>
      <MessageView />
    </div>
  );
};
export default Speaker;
