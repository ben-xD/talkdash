import { currentTime } from "../features/time/timeState";
import { onMount } from "solid-js";

const ClockPage = () => {
  onMount(() => {
    document.title = "Clock · TalkDash";
  });

  return (
    <h2 class="relative my-4 my-auto select-none text-center text-[20vw] tracking-tight drop-shadow-lg md:max-xl:text-[20vw]">
      {currentTime().toFormat("HH:mm:ss")}
    </h2>
  );
};

export default ClockPage;
