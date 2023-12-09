import { currentTime } from "../features/time/timeState";
import { onMount } from "solid-js";

export const ClockPage = () => {
  onMount(() => {
    document.title = "Clock · Talkdash";
  });

  return (
    <h2 class="relative my-auto select-none text-center text-[20vw] tracking-tight drop-shadow-lg md:max-xl:text-[20vw]">
      {currentTime().toFormat("HH:mm:ss")}
    </h2>
  );
};
