import {
  finishTime,
  redo,
  redoStack,
  setTextInputDurationInMinutes,
  setTimeAction,
  textInputDurationInMinutes,
  undo,
  undoStack,
} from "./time/timeState.js";
import { DateTime } from "luxon";
import { RightIcon } from "../assets/RightIcon.tsx";
import { LeftIcon } from "../assets/LeftIcon.tsx";
import { createSignal } from "solid-js";
import { Alert } from "../components/Alert.tsx";

// {/*TODO handle fuzzy input (e.g. 10 mins, 20 minutes, 1hr20m, average lifetime of an owl) */}
export function ConfigCard() {
  const [errorMessage, setErrorMessage] = createSignal<string>();

  const onStart = () => {
    const startTime = DateTime.now();

    const minutes = parseFloat(textInputDurationInMinutes());
    if (isNaN(minutes)) {
      setErrorMessage("Please enter a valid number of minutes.");
    } else {
      setErrorMessage(undefined);
    }
    const finishTime = startTime.plus({ minutes });
    setTimeAction({
      finishTime,
      startTime,
      userTalkLengthInput: textInputDurationInMinutes(),
    });
  };

  return (
    <div class="relative z-10 flex h-full flex-col items-stretch justify-between gap-8 text-blue-800">
      <div class="flex flex-col items-start gap-2">
        <Alert message={errorMessage()} />
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
          class="w-full rounded-lg bg-blue-200 p-2 shadow-inner"
          type="text"
          id="finishTime"
          value={textInputDurationInMinutes()}
          onInput={(e) => setTextInputDurationInMinutes(e.target.value)}
        />
      </div>
      <div class="flex w-full flex-wrap justify-between gap-2">
        <div class="flex gap-2">
          <button
            class="btn px-4 py-2"
            onClick={() => undo()}
            disabled={undoStack.length === 0}
          >
            <LeftIcon />
          </button>
          <button
            class="btn px-4 py-2"
            onClick={() => redo()}
            disabled={redoStack.length === 0}
          >
            <RightIcon />
          </button>
        </div>
        <div class="flex gap-2">
          <button
            disabled={!finishTime()}
            class="px-4 py-2 hover:text-blue-900 active:text-blue-700"
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
          <button
            disabled={!!finishTime() || !textInputDurationInMinutes()}
            class="rounded-md bg-blue-600 px-4 py-2 text-blue-50 shadow hover:bg-blue-500 active:bg-blue-700 disabled:bg-gray-400"
            onClick={onStart}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
