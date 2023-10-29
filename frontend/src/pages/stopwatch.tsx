import { currentTime } from "../features/time/timeState.ts";
import { createEffect, createSignal, onMount } from "solid-js";
import { DateTime } from "luxon";

const [startTime, setStartTime] = createSignal<DateTime>();

export const StopwatchPage = () => {
  onMount(() => {
    document.title = "Stopwatch · Talkdash";
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
    <div class="flex flex-col items-center p-4">
      <div class="flex justify-center gap-4 rounded-lg bg-blue-50 p-4 text-blue-800">
        <button
          disabled={!startTime()}
          class="px-4 py-2 hover:text-blue-900 active:text-blue-700"
          onClick={() => {
            setStartTime(undefined);
            setTime(undefined);
          }}
        >
          Reset
        </button>
        <button
          disabled={!!startTime()}
          class="rounded-md bg-blue-600 px-4 py-2 text-blue-50 shadow hover:bg-blue-500 active:bg-blue-700 disabled:bg-gray-400"
          onClick={() => setStartTime(DateTime.now())}
        >
          Start
        </button>
      </div>
      <h2 class="relative select-none text-center text-[20vw] tracking-tight md:max-xl:text-[20vw]">
        {time() ?? "00:00:00"}
      </h2>
    </div>
  );
};
