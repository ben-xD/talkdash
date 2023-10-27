import { createSignal, onMount } from "solid-js";
import { EditableStateField } from "../features/speaker/EditableStateField.tsx";
import {
  setSpeakerUsername,
  speakerUsername,
} from "../features/user/userState.ts";
import { loadQueryParams } from "./loadQueryParams.ts";
import { trpc } from "../client/trpc.ts";
import { TRPCClientError } from "@trpc/client";

const minLengthMessage = 1;

const Host = () => {
  const [message, setMessage] = createSignal("");
  const [errorMessage, setErrorMessage] = createSignal<string>();

  onMount(() => {
    document.title = "Event Host · Talkdash";
    loadQueryParams(false);
  });

  return (
    <div class="max-w-[400px] w-full my-4 gap-8 flex flex-col">
      <p>
        <span class="font-bold tracking-tight">Event host mode: </span>Enter a
        speaker username to send them messages.
      </p>
      <EditableStateField
        label={"Recipient speaker username"}
        value={speakerUsername}
        setValue={setSpeakerUsername}
      />
      <div class="flex flex-col text-cyan-800 bg-blue-50 items-start p-4 rounded-xl shadow-lg gap-4">
        {errorMessage() ? (
          <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative"
            role="alert"
          >
            <strong class="font-bold">Error.</strong>
            <span class="block sm:inline"> {errorMessage()}</span>
          </div>
        ) : (
          <></>
        )}
        <label
          for="submitMessage"
          class="flex flex-col items-start gap-2 w-full"
        >
          Send the speaker a private message
          <textarea
            autofocus
            minLength={minLengthMessage}
            class="text-cyan-800 w-full rounded-lg p-2 bg-blue-200 shadow-inner"
            placeholder="Please repeat the audience's question."
            value={message()}
            onInput={(e) => setMessage(e.target.value)}
          />
        </label>
        <div class="flex w-full justify-end mt-4">
          <button
            id="submitMessage"
            disabled={!speakerUsername() || message().length < minLengthMessage}
            class="bg-green-600 px-4 py-2 rounded-md disabled:bg-gray-500 text-white shadow active:bg-green-700 hover:bg-green-500"
            onClick={async () => {
              const username = speakerUsername();
              if (username) {
                // TODO handle error.
                try {
                  await trpc.message.sendMessageToSpeaker.mutate({
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
