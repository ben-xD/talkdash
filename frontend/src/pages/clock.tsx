import { currentTime } from "../features/time/timeState.ts";
import { onMount } from "solid-js";

export const ClockPage = () => {
  onMount(() => {
    document.title = "Clock · Talkdash";
  });

  return (
    <p class="relative my-auto select-none text-center text-[20vw]  tracking-tight md:max-xl:text-[20vw]">
      {currentTime().toFormat("HH:mm:ss")}
    </p>
  );
};
