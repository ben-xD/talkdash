import { MetadataView } from "../features/speaker/MetadataView.tsx";
import { ConfigCard } from "../features/ConfigCard.tsx";
import { TimeLeftDisplay } from "../features/time/TimeLeftDisplay.tsx";
import { MessageView } from "../features/messages/MessageView.tsx";
import { onCleanup, onMount } from "solid-js";
import { loadQueryParams } from "./loadQueryParams.js";
import { speakerUsername } from "../features/user/userState.js";
import { Unsubscribable } from "@trpc/server/observable";
import {
  receivedMessages,
  setReceivedMessages,
} from "../features/messages/receivedMessages.js";
import { DateTime } from "luxon";
import { trpc } from "../client/trpc.js";

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
        const lastMessage = receivedMessages[0];
        console.info(
          `Removing the oldest message, received ${lastMessage.receivedAt.toRelative()} after ${
            minimumMessageDisplayTimeInMs / 1000
          }s expiry.`,
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

  const reconnectAsSpeaker = (speakerUsername: string) => {
    messageSubscription?.unsubscribe();
    messageSubscription = trpc.message.subscribeMessages.subscribe(
      { speakerUsername },
      {
        onData: ({ emojiMessage, message }) => {
          const receivedAt = DateTime.now();
          console.info(`Received message at ${receivedAt}:\n${message}`);
          removeOldestMessageAfterExpiry(receivedAt);
          setReceivedMessages([
            ...receivedMessages,
            { receivedAt, message, emojiMessage },
          ]);
        },
      },
    );
  };

  onMount(() => {
    document.title = "Speaker · Talkdash";
    loadQueryParams();
    const username = speakerUsername();
    if (username) {
      reconnectAsSpeaker(username);
    }
  });

  onCleanup(() => {
    console.info("Unsubscribing from speaker messages");
    messageSubscription?.unsubscribe();
  });

  return (
    <div class="flex flex-col items-center">
      <div class="max-w-[400px] lg:max-w-4xl md:flex-row w-full flex flex-col items-stretch py-4">
        <MetadataView reconnectAsSpeaker={reconnectAsSpeaker} />
        <div class="py-4 my-2 bg-blue-50 p-4 rounded-xl w-full shadow-lg">
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
