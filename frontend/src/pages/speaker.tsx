import { SpeakerConfigView } from "../features/speaker/SpeakerConfigView.tsx";
import { TimerConfigCard } from "../features/TimerConfigCard.tsx";
import { isTimeLeft, TimeLeft } from "../features/time/TimeLeft";
import { MessageView } from "../features/messages/MessageView";
import { createEffect, createSignal, onCleanup, onMount, Show } from "solid-js";
import { loadQueryParams } from "../window/loadQueryParams.ts";
import {
  speakerUsername,
  registeredUsername,
  unsetTemporaryUsernames,
} from "../features/user/userState";
import { Unsubscribable } from "@trpc/server/observable";
import {
  receivedMessages,
  setReceivedMessages,
} from "../features/messages/receivedMessages";
import { DateTime } from "luxon";
import { preferredUsername, setPreferredUsername, trpc } from "../client/trpc";
import { setTimeAction } from "../features/time/timeState";
import { toast } from "solid-toast";
import { isQrCodeShown, QrCodeView } from "../components/QrCodeView.tsx";

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
    setTimeout(async () => {
      await loadQueryParams("speaker");
      const registered = registeredUsername();
      const temporarySpeakerUsername = speakerUsername();
      if (registered) {
        setPreferredUsername("speaker", registered);
        reconnectAsSpeaker(registered);
      } else if (temporarySpeakerUsername) {
        reconnectAsSpeaker(temporarySpeakerUsername);
      }
    }, 0);
  });

  onCleanup(() => {
    messageSubscription?.unsubscribe();
  });

  createEffect(() => {
    if (registeredUsername()) {
      unsetTemporaryUsernames("speaker");
    }
  });

  onCleanup(() => {
    console.info("Unsubscribing from speaker messages");
    messageSubscription?.unsubscribe();
  });

  const loadShareUrl = (): URL => {
    const speakerUsername = preferredUsername("speaker");
    const hostUrl = new URL("../", window.location.href);
    if (speakerUsername) {
      hostUrl.searchParams.set("speakerUsername", speakerUsername);
    }
    return hostUrl;
  };
  const [shareUrl, setShareUrl] = createSignal(loadShareUrl());

  // Update the share url whenever the speakerUsername changes
  createEffect(() => {
    setShareUrl(loadShareUrl());
  });

  createEffect(() => {
    const handleOnBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      return "";
    };

    // Only run this when it changes, not whenever the value is set
    const timeLeft = isTimeLeft();
    if (timeLeft) {
      window.addEventListener("beforeunload", handleOnBeforeUnload);
    }

    onCleanup(() => {
      window.removeEventListener("beforeunload", handleOnBeforeUnload);
    });
  });

  return (
    <div class="flex flex-col items-center gap-16">
      <div class="z-10 flex w-full max-w-[400px] flex-col items-stretch lg:max-w-4xl lg:flex-row">
        <SpeakerConfigView
          reconnectAsSpeaker={reconnectAsSpeaker}
          shareUrl={shareUrl()}
        />
        <TimerConfigCard class="z-20" />
      </div>
      <div class="-my-16 justify-center text-center ">
        <div class="flex text-[16vw] leading-[16vw] tracking-tight drop-shadow-lg md:max-xl:text-[18vw]">
          <TimeLeft />
        </div>
        <p class="font-normal text-primary-100">time left</p>
      </div>
      <MessageView />
      <Show
        when={shareUrl()}
        fallback={<h2>Couldn't get generate a QR code.</h2>}
      >
        {(shareUrl) => (
          <>
            <Show when={isQrCodeShown()}>
              <QrCodeView class="dark:hidden" text={shareUrl().toString()} />
              <QrCodeView
                class="hidden dark:flex"
                isDarkMode={true}
                text={shareUrl().toString()}
              />
            </Show>
          </>
        )}
      </Show>
    </div>
  );
};
export default Speaker;
