import { MetadataView } from "../features/speaker/MetadataView";
import { ConfigCard } from "../features/ConfigCard";
import { TimeLeft } from "../features/time/TimeLeft";
import { MessageView } from "../features/messages/MessageView";
import { onCleanup, onMount } from "solid-js";
import { loadQueryParams } from "./loadQueryParams";
import { speakerUsername } from "../features/user/userState";
import { Unsubscribable } from "@trpc/server/observable";
import {
  receivedMessages,
  setReceivedMessages,
} from "../features/messages/receivedMessages";
import { DateTime } from "luxon";
import { trpc } from "../client/trpc";
import { setTimeAction } from "../features/time/timeState";
import { Toast } from "../components/Toast";
import { toast } from "solid-toast";

const Speaker = () => {
  let messageSubscription: Unsubscribable | undefined = undefined;

  const reconnectAsSpeaker = async (speakerUsername: string) => {
    const times = await trpc.speaker.getTimeState.query({ speakerUsername });
    if (times && times.start && times.finish) {
      await setTimeAction({
        startTime: DateTime.fromMillis(times.start),
        finishTime: DateTime.fromMillis(times.finish),
        userTalkLengthInput: "",
      });
      toast(() => <p class="text-secondary-800">Restoring timer from cloud</p>);
    }

    messageSubscription?.unsubscribe();
    messageSubscription = trpc.speaker.subscribeMessagesAsSpeaker.subscribe(
      { speakerUsername },
      {
        onData: ({ emojiMessage, message, sender }) => {
          const receivedAt = DateTime.now();
          console.info(
            `Received message at ${receivedAt}:\n${message} from ${sender.username}`,
          );
          toast(() => <p class="text-secondary-800">Message received</p>);
          setReceivedMessages([
            { receivedAt, message, emojiMessage, sender },
            ...receivedMessages,
          ]);
        },
      },
    );
  };

  onMount(() => {
    document.title = "Speaker · Talkdash";
    setTimeout(() => {
      loadQueryParams("speaker");
      const username = speakerUsername();
      if (username) {
        reconnectAsSpeaker(username);
      }
    }, 0);
  });

  onCleanup(() => {
    console.info("Unsubscribing from speaker messages");
    messageSubscription?.unsubscribe();
  });

  return (
    <div class="flex flex-col items-center">
      <Toast />
      <div class="flex w-full max-w-[400px] flex-col items-stretch py-4 lg:max-w-4xl lg:flex-row">
        <MetadataView reconnectAsSpeaker={reconnectAsSpeaker} />
        <ConfigCard />
      </div>
      <div class="mb-8 justify-center text-center">
        <div class="flex text-[16vw] leading-[16vw] tracking-tight drop-shadow-lg md:max-xl:text-[18vw]">
          <TimeLeft />
        </div>
        <p class="font-normal text-primary-100">time left</p>
      </div>
      <MessageView />
    </div>
  );
};
export default Speaker;
