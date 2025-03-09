import { onCleanup, onMount } from "solid-js";
import { capturePageLeave, capturePageView } from "../AnalyticsEvents.ts";
import { cn } from "../css/tailwind";
import { currentTime, showMilliseconds } from "../features/time/timeState";
import { SettingsAccordion } from "../components/SettingsAccordion";

const ClockPage = () => {
  onMount(() => {
    document.title = "Clock · TalkDash";
    capturePageView();
    onCleanup(capturePageLeave);
  });
  return (
    <div class="flex h-[calc(100vh-120px)] flex-col items-center justify-center">
      <h2
        class={cn(
          "relative my-4 text-center tracking-tight drop-shadow-lg select-none",
          showMilliseconds() ? "text-[14vw]/[12vw]" : "text-[20vw]/[16vw]",
        )}
      >
        {currentTime().toFormat(
          showMilliseconds() ? "HH:mm:ss.SSS" : "HH:mm:ss",
        )}
      </h2>
      <div class="text-primary-100 my-8 text-4xl">
        {currentTime().toFormat("EEEE, MMMM d, yyyy")}
      </div>
      <div class="w-80">
        <SettingsAccordion />
      </div>
    </div>
  );
};

export default ClockPage;
