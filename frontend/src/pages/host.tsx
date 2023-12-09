import { createEffect, createSignal, onMount } from "solid-js";
import { EditableStateField } from "../features/speaker/EditableStateField";
import {
  setSpeakerUsername,
  speakerUsername,
} from "../features/user/userState.js";
import { loadQueryParams } from "./loadQueryParams";
import { trpc } from "../client/trpc";
import { TRPCClientError } from "@trpc/client";
import { Unsubscribable } from "@trpc/server/observable";
import { Alert } from "../components/Alert";
import {
  resetHistory,
  setFinishTime,
  setStartTime,
} from "../features/time/timeState";
import { DateTime } from "luxon";
import { TimeLeft } from "../features/time/TimeLeft";
import { ElapsedTime } from "../components/ElapsedTime";
import { toast } from "solid-toast";
import { Toast } from "../components/Toast";
import { cn } from "../css/tailwind";

const minLengthMessage = 1;

const [speakerExists, setSpeakerExists] = createSignal<boolean>();
const [isSending, setIsSending] = createSignal(false);

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
            if (event.start && event.finish) {
              toast(() => (
                <p class="text-secondary-800">The timer is running</p>
              ));
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

  const [isSendDisabled, setIsSendDisabled] = createSignal(false);
  const onSend = async () => {
    setIsSending(true);
    const username = speakerUsername();
    if (username) {
      setIsSendDisabled(true);
      try {
        // TODO figure out how to handle the error when the websocket connection is broken.
        // We don't know when requests fail because the websocket is broken, so we can't show an error to user
        // See https://github.com/trpc/trpc/discussions/4606
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
      } finally {
        setIsSendDisabled(false);
      }
    }
  };

  return (
    <div class="my-4 flex w-full max-w-[400px] flex-col gap-6">
      <Toast />
      <p>
        <span class="font-bold tracking-tight">Event host mode. </span>Enter a
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
      <div class="bg-primary-50 dark:bg-primary-900 dark:text-primary-200 text-secondary-800 flex flex-col items-start gap-4 rounded-xl p-4 shadow-lg">
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
            class="bg-primary-200 dark:bg-primary-500 min-h-[4rem] w-full rounded-lg p-2 shadow-inner"
            placeholder="Please repeat the audience's questions"
            value={message()}
            onInput={(e) => setMessage(e.target.value)}
          />
        </label>
        <div class="mt-4 flex w-full justify-end">
          <button
            id="submitMessage"
            aria-label={"Send message to speaker"}
            disabled={
              isSendDisabled() ||
              !speakerUsername() ||
              message().length < minLengthMessage
            }
            class="bg-primary-600 hover:bg-primary-500 active:bg-primary-700 text-primary-50 rounded-md px-4 py-2 shadow disabled:bg-gray-400"
            onAnimationEnd={() => setIsSending(false)}
            onClick={onSend}
          >
            <p
              class={cn("animate__animated", {
                animate__backOutRight: isSending(),
              })}
            >
              Send
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Host;
