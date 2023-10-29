import { MetadataView } from "../features/speaker/MetadataView.tsx";
import { ConfigCard } from "../features/ConfigCard.tsx";
import { TimeLeft } from "../features/time/TimeLeft.tsx";
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

const Speaker = () => {
  let messageSubscription: Unsubscribable | undefined = undefined;

  const reconnectAsSpeaker = (speakerUsername: string) => {
    messageSubscription?.unsubscribe();
    messageSubscription = trpc.speaker.subscribeMessagesAsSpeaker.subscribe(
      { speakerUsername },
      {
        onData: ({ emojiMessage, message }) => {
          const receivedAt = DateTime.now();
          console.info(`Received message at ${receivedAt}:\n${message}`);
          setReceivedMessages([
            { receivedAt, message, emojiMessage },
            ...receivedMessages,
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
      <div class="flex w-full max-w-[400px] flex-col items-stretch py-4 md:flex-row lg:max-w-4xl">
        <MetadataView reconnectAsSpeaker={reconnectAsSpeaker} />
        <div class="my-2 w-full rounded-xl bg-blue-50 p-4 py-4 shadow-lg">
          <ConfigCard />
        </div>
      </div>
      <div class="my-2 flex justify-center text-[14vw] leading-[18vw] tracking-tight drop-shadow-lg md:max-xl:text-[18vw]">
        <TimeLeft />
      </div>
      <MessageView />
    </div>
  );
};
export default Speaker;
