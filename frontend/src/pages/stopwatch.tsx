import {
  currentTime,
  setStartTime,
  startTime,
} from "../features/time/timeState.ts";
import { createEffect, createSignal } from "solid-js";
import { DateTime } from "luxon";
import { Button } from "../components/Button.tsx";

export const StopwatchPage = () => {
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
      <div class="flex gap-4 justify-center py-4">
        <Button
          disabled={!!startTime()}
          class="bg-slate-600 active:bg-slate-700 hover:bg-slate-500"
          onClick={() => setStartTime(DateTime.now())}
        >
          Start
        </Button>
        <Button
          disabled={!startTime()}
          class="bg-slate-600 active:bg-slate-700 hover:bg-slate-500"
          onClick={() => {
            setStartTime(undefined);
            setTime(undefined);
          }}
        >
          Reset
        </Button>
      </div>
      <p class="text-[20vw] md:max-xl:text-[20vw] text-center tracking-tight  select-none relative">
        {time() ?? "00:00:00"}
      </p>
    </div>
  );
};
