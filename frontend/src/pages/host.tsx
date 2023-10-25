import { createSignal, onMount } from "solid-js";
import { EditableStateField } from "../features/speaker/EditableStateField.tsx";
import {
  setSpeakerUsername,
  speakerUsername,
} from "../features/user/userState.ts";
import { loadQueryParams } from "./loadQueryParams.ts";
import { trpc } from "../client/trpc.ts";

const minLengthMessage = 5;

const Host = () => {
  const [message, setMessage] = createSignal("");

  onMount(() => {
    document.title = "Host · Talkdash";
    loadQueryParams(false);
  });

  return (
    <div class="max-w-[400px] w-full my-4 gap-8 flex flex-col">
      <p>
        <span class="font-bold tracking-tight">Host mode: </span>Enter a speaker
        username to send them messages.
      </p>
      <EditableStateField
        label={"Recipient speaker username"}
        value={speakerUsername}
        setValue={setSpeakerUsername}
      />
      <div class="flex flex-col text-cyan-800 bg-blue-50 items-start p-4 rounded-xl gap-8">
        <label
          for="submitMessage"
          class="flex flex-col items-start gap-2 w-full"
        >
          Send the speaker a private message (min: 5 characters)
          <textarea
            autofocus
            minLength={minLengthMessage}
            class="text-cyan-800 w-full rounded-lg p-2 bg-blue-200"
            placeholder="Please repeat the audience's question."
            value={message()}
            onInput={(e) => setMessage(e.target.value)}
          />
        </label>
        <div class="flex w-full justify-end">
          <button
            id="submitMessage"
            disabled={
              !speakerUsername() || message().length <= minLengthMessage
            }
            class="bg-green-600 px-4 py-2 rounded-md disabled:bg-gray-500 text-white"
            onClick={async () => {
              const username = speakerUsername();
              if (username) {
                // TODO handle error.
                await trpc.message.sendMessageToSpeaker.mutate({
                  speakerUsername: username,
                  message: message(),
                });
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
