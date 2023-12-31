import { currentTime } from "../features/time/timeState";
import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { DateTime } from "luxon";
import { capturePageLeave, capturePageView } from "../AnalyticsEvents.ts";

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
        const time = diff.toFormat("hh:mm:ss");
        setTime(time);
      }
    }
  });

  return (
    <div class="my-4 flex flex-col items-center p-4">
      <div class="flex justify-center gap-4 rounded-lg bg-primary-50 p-4 text-primary-800">
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
      <h2 class="relative select-none text-center text-[20vw] tracking-tight drop-shadow-lg md:max-xl:text-[20vw]">
        {time() ?? "00:00:00"}
      </h2>
    </div>
  );
};

export default StopwatchPage;
