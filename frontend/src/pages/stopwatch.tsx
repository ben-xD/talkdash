import {
  currentTime,
  setStartTime,
  startTime,
} from "../features/time/timeState.ts";
import { createEffect, createSignal, onMount } from "solid-js";
import { DateTime } from "luxon";

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
    <div class="flex flex-col">
      <div class="flex justify-center gap-4 py-4">
        <button
          disabled={!!startTime()}
          class="btn"
          onClick={() => setStartTime(DateTime.now())}
        >
          Start
        </button>
        <button
          disabled={!startTime()}
          class="btn"
          onClick={() => {
            setStartTime(undefined);
            setTime(undefined);
          }}
        >
          Reset
        </button>
      </div>
      <p class="relative select-none text-center text-[20vw]  tracking-tight md:max-xl:text-[20vw]">
        {time() ?? "00:00:00"}
      </p>
    </div>
  );
};
