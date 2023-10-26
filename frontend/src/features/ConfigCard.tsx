import {
  finishTime,
  redo,
  redoStack,
  setTextInputDurationInMinutes,
  setTimeAction,
  textInputDurationInMinutes,
  undo,
  undoStack,
} from "./time/timeState.ts";
import { DateTime } from "luxon";
import { RightIcon } from "../assets/RightIcon.tsx";
import { LeftIcon } from "../assets/LeftIcon.tsx";

// {/*TODO handle fuzzy input (e.g. 10 mins, 20 minutes, 1hr20m, average lifetime of an owl) */}
export function ConfigCard() {
  const onStart = () => {
    const startTime = DateTime.now();

    // TODO handle parseFloat error.
    const minutes = parseFloat(textInputDurationInMinutes());
    const finishTime = startTime.plus({ minutes });
    setTimeAction({
      finishTime,
      startTime,
      userTalkLengthInput: textInputDurationInMinutes(),
    });
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
          value={textInputDurationInMinutes()}
          onInput={(e) => setTextInputDurationInMinutes(e.target.value)}
        />
      </div>
      <div class="flex flex-wrap gap-2 text-blue-50 w-full justify-between">
        <div class="flex gap-2">
          <button
            class="px-4 py-2 rounded-md disabled:bg-gray-400 bg-gray-900"
            onClick={() => undo()}
            disabled={undoStack.length === 0}
          >
            <LeftIcon />
          </button>
          <button
            class="px-4 py-2 rounded-md disabled:bg-gray-400 bg-gray-900"
            onClick={() => redo()}
            disabled={redoStack.length === 0}
          >
            <RightIcon />
          </button>
        </div>
        <div class="flex gap-2">
          <button
            disabled={!!finishTime() || !textInputDurationInMinutes()}
            class="bg-green-600 px-4 py-2 rounded-md disabled:bg-gray-400"
            onClick={onStart}
          >
            Start
          </button>
          <button
            disabled={!finishTime()}
            class="bg-red-600 disabled:bg-gray-400 px-4 py-2 rounded-md"
            onClick={() => {
              setTimeAction({
                finishTime: undefined,
                startTime: undefined,
                userTalkLengthInput: textInputDurationInMinutes(),
              });
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
