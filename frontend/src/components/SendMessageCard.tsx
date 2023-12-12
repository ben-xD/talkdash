import { Alert } from "./Alert.tsx";
import {
  registeredUsername,
  speakerUsername,
} from "../features/user/userState.js";
import { cn } from "../css/tailwind.ts";
import { createEffect, createSignal } from "solid-js";
import { trpc } from "../client/trpc.ts";
import { TRPCClientError } from "@trpc/client";
import { toast } from "solid-toast";
import { setFinishTime, setStartTime } from "../features/time/timeState.ts";
import { DateTime } from "luxon";
import { Unsubscribable } from "@trpc/server/observable";
import { Role } from "@talkdash/schema";

const minLengthMessage = 1;

const [speakerExists, setSpeakerExists] = createSignal<boolean>();
const [isSending, setIsSending] = createSignal(false);

export const SendMessageCard = (props: { senderRole: Role }) => {
  const [message, setMessage] = createSignal("");
  const [errorMessage, setErrorMessage] = createSignal<string>();
  const [isSendDisabled, setIsSendDisabled] = createSignal(false);

  let eventSubscription: Unsubscribable | undefined = undefined;
  const reconnectAsSender = (speakerUsername?: string) => {
    if (!speakerUsername) return;
    setSpeakerExists(undefined);
    eventSubscription?.unsubscribe();
    eventSubscription = trpc.sender.subscribeForSpeakerEvents.subscribe(
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
    reconnectAsSender(speakerUsername());
  });

  const onSend = async () => {
    setIsSending(true);
    const senderUsername = registeredUsername();
    const recipientUsername = speakerUsername();
    if (recipientUsername) {
      setIsSendDisabled(true);
      try {
        // TODO figure out how to handle the error when the websocket connection is broken.
        // We don't know when requests fail because the websocket is broken, so we can't show an error to user
        // See https://github.com/trpc/trpc/discussions/4606
        await trpc.sender.sendMessageToSpeaker.mutate({
          speakerUsername: recipientUsername,
          message: message(),
          role: props.senderRole,
          senderUsername,
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
    <div class=" flex flex-col items-start gap-4 rounded-xl bg-primary-50 p-4 text-secondary-800 shadow-lg dark:bg-primary-900 dark:text-primary-200">
      <Alert message={errorMessage()} />
      <label for="submitMessage" class="flex w-full flex-col items-start gap-2">
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
          class="textarea min-h-[4rem]"
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
          class="rounded-md bg-primary-600 px-4 py-2 text-primary-50 shadow hover:bg-primary-500 active:bg-primary-700 disabled:bg-gray-400"
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
  );
};
