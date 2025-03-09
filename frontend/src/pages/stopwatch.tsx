import { currentTime, showMilliseconds } from "../features/time/timeState";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { DateTime } from "luxon";
import { capturePageLeave, capturePageView } from "../AnalyticsEvents.ts";
import { cn } from "../css/tailwind.ts";
import { SettingsAccordion } from "../components/SettingsAccordion";

const [startTime, setStartTime] = createSignal<DateTime>();

const StopwatchPage = () => {
  onMount(() => {
    document.title = "Stopwatch · TalkDash";
    capturePageView();
    onCleanup(capturePageLeave);
  });

  const [time, setTime] = createSignal<string>();
  createEffect(() => {
    const start = startTime();
    if (start) {
      const diff = currentTime().diff(start);
      if (diff.toMillis() <= 0) {
        // To avoid glitching to -1 at the start of the stopwatch.
        setTime(undefined);
      } else {
        const time = diff.toFormat(
          showMilliseconds() ? "hh:mm:ss.SSS" : "hh:mm:ss",
        );
        setTime(time);
      }
    }
  });

  const zeroTime = () => (showMilliseconds() ? "00:00:00.000" : "00:00:00");

  return (
    <div class="my-4 flex h-[calc(100vh-120px)] flex-col items-center justify-center p-4">
      <div class="z-10 flex justify-center gap-4 rounded-lg bg-primary-50 p-4 text-primary-800">
        <button
          aria-label={"Reset timer"}
          disabled={!startTime()}
          class="px-4 py-2 hover:text-primary-900 active:text-primary-700"
          onClick={() => {
            setStartTime(undefined);
            setTime(undefined);
          }}
        >
          Reset
        </button>
        <button
          aria-label={"Start timer"}
          disabled={!!startTime()}
          class="rounded-md bg-primary-600 px-4 py-2 text-primary-50 shadow hover:bg-primary-500 active:bg-primary-700 disabled:bg-gray-400"
          onClick={() => setStartTime(DateTime.now())}
        >
          Start
        </button>
      </div>
      <h2
        class={cn(
          "relative z-0 select-none text-center tracking-tight drop-shadow-lg",
          showMilliseconds() ? "text-[14vw]/[12vw]" : "text-[20vw]/[16vw]",
        )}
      >
        {time() ?? zeroTime()}
      </h2>
      <div class="z-10 my-8 w-80">
        <SettingsAccordion />
      </div>
    </div>
  );
};

export default StopwatchPage;
