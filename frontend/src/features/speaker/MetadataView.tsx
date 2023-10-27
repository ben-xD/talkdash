import { currentTime, difference, startTime } from "../time/timeState.ts";
import { setSpeakerUsername, speakerUsername } from "../user/userState.ts";
import { EditableStateField } from "./EditableStateField.tsx";
import { ShareIcon } from "../../assets/ShareIcon.tsx";

const elapsedTime = () => {
  const start = startTime();
  if (!start) return { formattedDifference: "00:00:00" };
  return difference(start, currentTime());
};

export const MetadataView = () => {
  return (
    <div class="py-4 my-2 p-4 rounded-xl flex flex-col gap-4 items-stretch w-full">
      <div class="flex justify-between items-start">
        <p>
          <span class="font-bold tracking-tight">Speaker mode: </span>
          Choose a talk length and start the timer. Optional: share links with
          hosts.
        </p>
        <div
          class="hover:text-blue-100 active:text-white cursor-pointer"
          onClick={async () => {
            const hostUrl = new URL("../host", window.location.href);
            const username = speakerUsername();
            if (username) {
              hostUrl.searchParams.set("speakerUsername", username);
            }
            await navigator.clipboard.writeText(hostUrl.toString());
          }}
        >
          <ShareIcon />
        </div>
      </div>
      <div class="flex gap-2">
        <span class="font-bold">Elapsed:</span>
        <span>{elapsedTime().formattedDifference}</span>
      </div>

      <EditableStateField
        label="Username"
        value={speakerUsername}
        setValue={setSpeakerUsername}
      />
      {/*Temporarily disable password field since it is not implemented.*/}
      {/*<EditableStateField*/}
      {/*  label="Password"*/}
      {/*  value={password}*/}
      {/*  setValue={setPassword}*/}
      {/*/>*/}
    </div>
  );
};
