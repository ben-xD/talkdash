import { currentTime, difference, startTime } from "../time/timeState.ts";
import {
  password,
  setPassword,
  setUsername,
  username,
} from "../user/userState.ts";
import { MetadataInput } from "./MetadataInput.tsx";

const elapsedTime = () => {
  const start = startTime();
  if (!start) return { seconds: "00", minutes: "00", hours: "00" };
  return difference(start, currentTime());
};

export const MetadataView = () => {
  return (
    <div class="py-4 my-2 p-4 rounded-xl gap-2 flex flex-col gap-4">
      <div class="flex gap-2">
        <span class="font-bold">Elapsed:</span>
        <span>
          {elapsedTime().hours}:{elapsedTime().minutes}:{elapsedTime().seconds}
        </span>
      </div>

      <MetadataInput label="Username" value={username} setValue={setUsername} />
      <MetadataInput label="Password" value={password} setValue={setPassword} />
    </div>
  );
};
