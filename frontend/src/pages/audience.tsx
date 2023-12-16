import { createEffect, onMount } from "solid-js";
import { loadQueryParams } from "../window/loadQueryParams.ts";
import { EditableStateField } from "../features/speaker/EditableStateField.jsx";
import {
  updateSpeakerUsername,
  speakerUsername,
  registeredUsername,
  unsetTemporaryUsernames,
} from "../features/user/userState.js";
import { resetHistory } from "../features/time/timeState.js";
import { SendMessageCard } from "../components/SendMessageCard.jsx";
import { preferredUsername, setPreferredUsername } from "../client/trpc.ts";
import { ElapsedTime } from "../components/ElapsedTime.tsx";

const Audience = () => {
  onMount(() => {
    document.title = "Audience · Talkdash";
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
    <div class="flex w-full max-w-[400px] flex-col gap-6">
      <p>
        <span class="font-bold">Audience mode. </span>Enter a speaker username
        to send them messages.
      </p>
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
          updateSpeakerUsername(value);
        }}
      />
      <ElapsedTime />
      <SendMessageCard senderRole="audience" />
    </div>
  );
};

export default Audience;
