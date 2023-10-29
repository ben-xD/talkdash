import { createEffect, createSignal, onMount } from "solid-js";
import { EditableStateField } from "../features/speaker/EditableStateField.tsx";
import {
  setSpeakerUsername,
  speakerUsername,
} from "../features/user/userState.js";
import { loadQueryParams } from "./loadQueryParams.js";
import { trpc } from "../client/trpc.js";
import { TRPCClientError } from "@trpc/client";
import { Unsubscribable } from "@trpc/server/observable";
import { Alert } from "../components/Alert.tsx";
import {
  resetHistory,
  setFinishTime,
  setStartTime,
} from "../features/time/timeState.ts";
import { DateTime } from "luxon";
import { TimeLeft } from "../features/time/TimeLeft.tsx";
import { ElapsedTime } from "../components/ElapsedTime.tsx";
import { toast } from "solid-toast";
import { Toast } from "../components/Toast.tsx";

const minLengthMessage = 1;

const [speakerExists, setSpeakerExists] = createSignal<boolean>();

const Host = () => {
  const [message, setMessage] = createSignal("");
  const [errorMessage, setErrorMessage] = createSignal<string>();
  let eventSubscription: Unsubscribable | undefined = undefined;

  const reconnectAsHost = (speakerUsername: string) => {
    setSpeakerExists(undefined);
    eventSubscription?.unsubscribe();
    eventSubscription = trpc.host.subscribeForSpeakerEvents.subscribe(
      { speakerUsername },
      {
        onData: (event) => {
          const { type } = event;
          console.info(`${speakerUsername} event: ${type}`);
          if (type === "speakerCreated") {
            setSpeakerExists(true);
          } else if (type === "speakerDeleted") {
            setSpeakerExists(false);
          } else if (type === "speakerTimesUpdated") {
            if (!event.start && !event.finish) {
              toast(() => <p class="text-cyan-800">The timer was reset</p>);
            } else {
              toast(() => <p class="text-cyan-800">The timer is running</p>);
            }
            setStartTime(
              event.start ? DateTime.fromMillis(event.start) : undefined,
            );
            setFinishTime(
              event.finish ? DateTime.fromMillis(event.finish) : undefined,
            );
          }
        },
      },
    );
  };

  createEffect(() => {
    const username = speakerUsername();
    if (username) {
      reconnectAsHost(username);
    }
  });

  onMount(() => {
    document.title = "Event Host · Talkdash";
    loadQueryParams(false);
  });

  return (
    <div class="my-4 flex w-full max-w-[400px] flex-col gap-6">
      <Toast />
      <p>
        <span class="font-bold tracking-tight">Event host mode: </span>Enter a
        speaker username to send them messages.
      </p>
      <EditableStateField
        label={"Speaker username"}
        value={speakerUsername}
        setValue={(value) => {
          resetHistory();
          setSpeakerUsername(value);
        }}
      />
      <ElapsedTime />
      <div class="flex gap-2 font-bold">
        <TimeLeft />
        <span class="font-normal">time left</span>
      </div>
      {/*<div class="flex justify-center text-7xl tracking-tight drop-shadow-lg">*/}
      {/*  <TimeLeft />*/}
      {/*</div>*/}
      <div class="flex flex-col items-start gap-4 rounded-xl bg-blue-50 p-4 text-cyan-800 shadow-lg">
        <Alert message={errorMessage()} />
        <label
          for="submitMessage"
          class="flex w-full flex-col items-start gap-2"
        >
          <p>
            {!speakerUsername() || speakerUsername()?.length === 0 ? (
              <span>{"Specify a speaker, then message them..."}</span>
            ) : (
              <p>
                Message{" "}
                <span class="font-bold tracking-tight">
                  "{speakerUsername()}"{" "}
                </span>
                {!speakerExists() ? <span>(speaker not found)</span> : <></>}
              </p>
            )}
          </p>
          <textarea
            autofocus
            minLength={minLengthMessage}
            class="w-full rounded-lg bg-blue-200 p-2 text-cyan-800 shadow-inner"
            placeholder="Please repeat the audience's questions"
            value={message()}
            onInput={(e) => setMessage(e.target.value)}
          />
        </label>
        <div class="mt-4 flex w-full justify-end">
          <button
            id="submitMessage"
            disabled={!speakerUsername() || message().length < minLengthMessage}
            class="rounded-md bg-blue-600 px-4 py-2 text-blue-50 shadow hover:bg-blue-500 active:bg-blue-700 disabled:bg-gray-400"
            onClick={async () => {
              const username = speakerUsername();
              if (username) {
                // TODO handle error.
                try {
                  await trpc.host.sendMessageToSpeaker.mutate({
                    speakerUsername: username,
                    message: message(),
                  });
                  setMessage("");
                  setErrorMessage();
                } catch (e) {
                  if (e instanceof TRPCClientError) {
                    setErrorMessage(e.message);
                  } else {
                    setErrorMessage("An unknown error occurred.");
                  }
                }
              }
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Host;
