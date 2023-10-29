import { currentTime } from "../features/time/timeState.ts";
import { onMount } from "solid-js";

export const ClockPage = () => {
  onMount(() => {
    document.title = "Clock · Talkdash";
  });

  return (
    <p class="text-[20vw] my-auto md:max-xl:text-[20vw] text-center tracking-tight  select-none relative">
      {currentTime().toFormat("HH:mm:ss")}
    </p>
  );
};
