import { createEffect, createSignal, onMount, Show } from "solid-js";
import { EditableStateField } from "../features/speaker/EditableStateField";
import {
  speakerUsername,
  registeredUsername,
  unsetTemporaryUsernames,
  updateSubscribedSpeakerUsername,
} from "../features/user/userState.js";
import { loadQueryParams } from "../window/loadQueryParams.ts";
import { TimeLeft } from "../features/time/TimeLeft";
import { ElapsedTime } from "../components/ElapsedTime";
import { SendMessageCard } from "../components/SendMessageCard.tsx";
import {
  preferredUsername,
  setPreferredUsername,
  trpc,
} from "../client/trpc.ts";
import {
  isSendersPinRequired,
  PinAttempt,
  setSendersPin,
} from "../features/speaker/pin.tsx";
import { Alert } from "../components/Alert.tsx";
import { TRPCClientError } from "@trpc/client";
import { captureAnalyticsEvent } from "../AnalyticsEvents.ts";

const Host = () => {
  const [pinErrorMessage, setPinErrorMessage] = createSignal<
    string | undefined
  >();
  const [isPinCorrect, setIsPinCorrect] = createSignal<boolean | undefined>();

  onMount(() => {
    document.title = "Event Host · TalkDash";
    captureAnalyticsEvent("pageLoad", { page: "host" });

    setTimeout(async () => {
      await loadQueryParams("host");
    }, 0);
  });

  createEffect(() => {
    if (registeredUsername()) {
      unsetTemporaryUsernames("host");
    }
  });

  const setPin = async (pin: string) => {
    const speaker = speakerUsername();
    if (speaker) {
      setSendersPin(pin);
      try {
        await trpc.sender.validatePin.mutate({
          pin,
          speakerUsername: speaker,
        });
        setPinErrorMessage(undefined);
        setIsPinCorrect(true);
      } catch (e) {
        setIsPinCorrect(false);
        if (e instanceof TRPCClientError) {
          const { message } = e;
          setPinErrorMessage(`Pin verification failed. ${message}`);
        } else {
          setPinErrorMessage(`Pin verification failed.`);
        }
      }
    } else {
      setPinErrorMessage("Select a speaker first");
    }
  };

  return (
    <div class="my-4 flex max-w-[400px] flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h1 class="lg:text-2xl">Event host</h1>
        <h2 class="text-sm">
          Enter a speaker username to see information or send them messages
        </h2>
      </div>
      <EditableStateField
        label={"Your name"}
        value={preferredUsername("host")}
        setValue={(value) => {
          setPreferredUsername("host", value);
        }}
      />
      <EditableStateField
        label={"Speaker username"}
        value={speakerUsername()}
        setValue={(username) => {
          updateSubscribedSpeakerUsername(username);
        }}
      />
      <Show when={isSendersPinRequired()}>
        <Alert message={pinErrorMessage()} />
        <PinAttempt setPin={setPin} isCorrect={isPinCorrect()} />
      </Show>
      <ElapsedTime />
      <div class="flex gap-2 font-bold">
        <TimeLeft />
        <span class="font-normal">time left</span>
      </div>
      <SendMessageCard senderRole="host" />
    </div>
  );
};

export default Host;
