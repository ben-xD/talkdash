import { createSignal, onMount } from "solid-js";
import { EditableStateField } from "../features/speaker/EditableStateField.tsx";
import { setUsername, username } from "../features/user/userState.ts";
import { loadQueryParams } from "./loadQueryParams.ts";
import { trpc } from "../client/trpcClient.ts";

const Host = () => {
  const [message, setMessage] = createSignal("");

  onMount(() => {
    document.title = "Host · Talkdash";
    loadQueryParams(false);
  });

  return (
    <div class="max-w-[400px] w-full my-4 gap-8 flex flex-col">
      <EditableStateField
        label={"Recipient speaker username"}
        value={username}
        setValue={setUsername}
      />
      <div class="flex flex-col items-start">
        <label class="flex flex-col items-start gap-2 w-full">
          Send the speaker a private message
          <textarea
            class="text-cyan-800 w-full"
            placeholder="Please repeat the audience's question."
            value={message()}
            onInput={(e) => setMessage(e.target.value)}
          />
          <button
            disabled={message().length <= 5}
            class="bg-green-600 px-4 py-2 rounded-md disabled:bg-gray-500"
            onClick={async () => {
              const speakerUsername = username();
              if (speakerUsername) {
                // TODO handle error.
                await trpc.message.speaker.mutate({
                  speakerUsername,
                  message: message(),
                });
              }
            }}
          >
            Send
          </button>
        </label>
      </div>
    </div>
  );
};

export default Host;
