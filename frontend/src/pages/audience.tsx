import { createEffect, onMount } from "solid-js";
import { loadQueryParams } from "../window/loadQueryParams.ts";
import { EditableStateField } from "../features/speaker/EditableStateField.jsx";
import {
  speakerUsername,
  registeredUsername,
  unsetTemporaryUsernames,
  updateSubscribedSpeakerUsername,
} from "../features/user/userState.js";
import { resetHistory } from "../features/time/timeState.js";
import { SendMessageCard } from "../components/SendMessageCard.jsx";
import { preferredUsername, setPreferredUsername } from "../client/trpc.ts";
import { ElapsedTime } from "../components/ElapsedTime.tsx";

const Audience = () => {
  onMount(() => {
    document.title = "Audience · TalkDash";
    setTimeout(async () => {
      await loadQueryParams("audience");
    }, 0);
  });

  createEffect(() => {
    if (registeredUsername()) {
      unsetTemporaryUsernames("audience");
    }
  });

  return (
    <div class="my-4 flex max-w-[400px] flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h1 class="lg:text-2xl">Audience</h1>
        <h2 class="text-sm">
          Enter a speaker username to see information or send them messages
        </h2>
      </div>
      <EditableStateField
        label={"Your name"}
        value={preferredUsername("audience")}
        setValue={(value) => {
          setPreferredUsername("audience", value);
        }}
      />
      <EditableStateField
        label={"Speaker username"}
        value={speakerUsername()}
        setValue={(value) => {
          resetHistory();
          updateSubscribedSpeakerUsername(value);
        }}
      />
      <ElapsedTime />
      <SendMessageCard senderRole="audience" />
    </div>
  );
};

export default Audience;
