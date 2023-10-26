import { createSignal } from "solid-js";
import { finishTime, setFinishTime, setStartTime } from "./time/timeState.ts";
import { DateTime } from "luxon";

// {/*TODO handle fuzzy input (e.g. 10 mins, 20 minutes, 1hr20m, average lifetime of an owl) */}
export function ConfigCard() {
  const [durationInMinutes, setDurationInMinutes] = createSignal("");

  const onStart = () => {
    const startTime = DateTime.now();

    const minutes = parseFloat(durationInMinutes());
    // TODO handle parseFloat error.
    const finishTime = startTime.plus({ minutes });
    setStartTime(startTime);
    setFinishTime(finishTime);
  };

  return (
    <div class="flex flex-col gap-8 text-cyan-800 z-10 relative items-stretch h-full justify-between">
      <div class="flex flex-col gap-2 items-start">
        <label class="whitespace-normal break-words" for="finishTime">
          Talk length (minutes)*
        </label>
        <input
          required
          placeholder="20.5"
          autofocus
          onKeyUp={(e) => {
            // If user presses enter, submit
            if (e.key === "Enter") {
              if (!finishTime()) {
                onStart();
              }
            }
          }}
          class="bg-blue-200 rounded-lg p-2 w-full"
          type="text"
          id="finishTime"
          onInput={(e) => setDurationInMinutes(e.target.value)}
        />
      </div>
      <div class="flex flex-wrap gap-2 text-blue-50 w-full justify-end">
        <button
          disabled={!!finishTime() || !durationInMinutes()}
          class="bg-green-600 px-4 py-2 rounded-md disabled:bg-gray-500"
          onClick={onStart}
        >
          Start
        </button>
        <button
          disabled={!finishTime()}
          class="bg-red-600 disabled:bg-gray-500 px-4 py-2 rounded-md"
          onClick={() => {
            setStartTime(undefined);
            setFinishTime(undefined);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
