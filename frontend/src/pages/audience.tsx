import { createEffect, onMount } from "solid-js";
import { loadQueryParams } from "./loadQueryParams.js";
import { EditableStateField } from "../features/speaker/EditableStateField.jsx";
import {
  updateAudienceUsername,
  updateSpeakerUsername,
  speakerUsername,
  registeredUsername,
  unsetTemporaryUsernames,
} from "../features/user/userState.js";
import { resetHistory } from "../features/time/timeState.js";
import { SendMessageCard } from "../components/SendMessageCard.jsx";
import { preferredUsername } from "../client/trpc.ts";

const Audience = () => {
  onMount(() => {
    document.title = "Audience · Talkdash";
    setTimeout(() => {
      loadQueryParams("audience");
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
        disabled={!!preferredUsername("audience")}
        setValue={(value) => {
          updateAudienceUsername(value);
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
      <SendMessageCard senderRole="audience" />
    </div>
  );
};

export default Audience;
