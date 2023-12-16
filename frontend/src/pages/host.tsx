import { createEffect, createSignal, onMount, Show } from "solid-js";
import { EditableStateField } from "../features/speaker/EditableStateField";
import {
  updateSpeakerUsername,
  speakerUsername,
  registeredUsername,
  unsetTemporaryUsernames,
} from "../features/user/userState.js";
import { loadQueryParams } from "../window/loadQueryParams.ts";
import { resetHistory } from "../features/time/timeState";
import { TimeLeft } from "../features/time/TimeLeft";
import { ElapsedTime } from "../components/ElapsedTime";
import { SendMessageCard } from "../components/SendMessageCard.tsx";
import { preferredUsername, setPreferredUsername } from "../client/trpc.ts";
import {
  isSendersPinRequired,
  setAndValidatePinForSender,
  PinAttempt,
} from "../features/speaker/pin.tsx";
import { Alert } from "../components/Alert.tsx";
import { TRPCClientError } from "@trpc/client";

const Host = () => {
  const [pinErrorMessage, setPinErrorMessage] = createSignal<
    string | undefined
  >();
  const [isPinCorrect, setIsPinCorrect] = createSignal<boolean | undefined>();

  onMount(() => {
    document.title = "Event Host · Talkdash";
    setTimeout(async () => {
      await loadQueryParams("host");
      const registered = registeredUsername();
      if (registered) {
        setPreferredUsername("speaker", registered);
      }
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
      try {
        await setAndValidatePinForSender(pin, speaker);
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
    <div class="flex w-full max-w-[400px] flex-col gap-6">
      <p>
        <span class="font-bold tracking-tight">Event host mode. </span>Enter a
        speaker username to send them messages.
      </p>
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
        setValue={(value) => {
          resetHistory();
          updateSpeakerUsername(value);
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
