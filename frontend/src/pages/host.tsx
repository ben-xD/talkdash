import { onMount } from "solid-js";
import { EditableStateField } from "../features/speaker/EditableStateField";
import {
  hostUsername,
  setHostUsername,
  setSpeakerUsername,
  speakerUsername,
} from "../features/user/userState.js";
import { loadQueryParamsWithDelay } from "./loadQueryParams";
import { resetHistory } from "../features/time/timeState";
import { TimeLeft } from "../features/time/TimeLeft";
import { ElapsedTime } from "../components/ElapsedTime";
import { Toast } from "../components/Toast";
import { SendMessageCard } from "../components/SendMessageCard.tsx";

const Host = () => {
  onMount(() => {
    document.title = "Event Host · Talkdash";
    loadQueryParamsWithDelay("host");
  });

  return (
    <div class="flex w-full max-w-[400px] flex-col gap-6">
      <Toast />
      <p>
        <span class="font-bold tracking-tight">Event host mode. </span>Enter a
        speaker username to send them messages.
      </p>
      <EditableStateField
        label={"Your name"}
        value={hostUsername}
        setValue={(value) => {
          setHostUsername(value);
        }}
      />
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
      <SendMessageCard />
    </div>
  );
};

export default Host;
