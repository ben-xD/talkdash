import { createEffect, onMount } from "solid-js";
import { EditableStateField } from "../features/speaker/EditableStateField";
import {
  updateHostUsername,
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
import { preferredUsername } from "../client/trpc.ts";

const Host = () => {
  onMount(() => {
    document.title = "Event Host · Talkdash";
    setTimeout(() => {
      loadQueryParams("host");
      if (registeredUsername()) {
        unsetTemporaryUsernames("host");
      }
    }, 0);
  });

  createEffect(() => {
    if (registeredUsername()) {
      unsetTemporaryUsernames("host");
    }
  });

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
          updateHostUsername(value);
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
      <div class="flex gap-2 font-bold">
        <TimeLeft />
        <span class="font-normal">time left</span>
      </div>
      <SendMessageCard senderRole="host" />
    </div>
  );
};

export default Host;
