import { currentTime } from "../features/time/timeState";
import { onMount } from "solid-js";
import { captureAnalyticsEvent } from "../AnalyticsEvents.ts";

const ClockPage = () => {
  onMount(() => {
    document.title = "Clock · TalkDash";
    captureAnalyticsEvent("pageLoad", { page: "clock" });
  });

  return (
    <h2 class="relative my-4 select-none text-center text-[20vw] tracking-tight drop-shadow-lg md:max-xl:text-[20vw]">
      {currentTime().toFormat("HH:mm:ss")}
    </h2>
  );
};

export default ClockPage;
