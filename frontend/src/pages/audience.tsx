import { onMount } from "solid-js";
import { loadQueryParams } from "./loadQueryParams.ts";
import { Toast } from "../components/Toast.tsx";
import { EditableStateField } from "../features/speaker/EditableStateField.tsx";
import {
  audienceUsername,
  setAudienceUsername,
  setSpeakerUsername,
  speakerUsername,
} from "../features/user/userState.ts";
import { resetHistory } from "../features/time/timeState.ts";
import { SendMessageCard } from "../components/SendMessageCard.tsx";

const Audience = () => {
  onMount(() => {
    document.title = "Audience · Talkdash";
    loadQueryParams("audience");
  });

  return (
    <div class="my-4 flex w-full max-w-[400px] flex-col gap-6">
      <Toast />
      <p>
        <span class="font-bold">Audience mode. </span>Enter a speaker username
        to send them messages.
      </p>
      <EditableStateField
        label={"Your name"}
        value={audienceUsername}
        setValue={(value) => {
          setAudienceUsername(value);
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
      <SendMessageCard />
    </div>
  );
};

export default Audience;
