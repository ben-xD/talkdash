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
import { trpc } from "../client/trpc.ts";

export function ConfigCard() {
  const [errorMessage, setErrorMessage] = createSignal<string>();

  const isInputNumeric = () => {
    const minutes = Number(textInputDurationInMinutes());
    return !isNaN(minutes);
  };

  const onStart = async () => {
    let minutes: number | undefined = parseFloat(textInputDurationInMinutes());
    if (!isInputNumeric()) {
      minutes = await trpc.speaker.estimateDurationInMinutesOf.query({
        durationDescription: textInputDurationInMinutes(),
      });
    }
    if (!minutes) {
      setErrorMessage("Could not estimate duration.");
    } else {
      const startTime = DateTime.now();
      setErrorMessage(undefined);
      const finishTime = startTime.plus({ minutes });
      await setTimeAction(
        {
          finishTime,
          startTime,
          userTalkLengthInput: textInputDurationInMinutes(),
        },
        true,
      );
    }
  };

  const onReset = () =>
    setTimeAction({
      finishTime: undefined,
      startTime: undefined,
      userTalkLengthInput: textInputDurationInMinutes(),
    });

  return (
    <div class="relative z-10 flex h-full flex-col items-stretch justify-between gap-8 text-blue-800 dark:text-blue-200">
      <div class="flex flex-col items-start gap-2">
        <Alert message={errorMessage()} />
        <label class="whitespace-normal break-words" for="finishTime">
          Talk length
          <p class="text-blue-400">
            This can be number of minutes or free text
          </p>
        </label>
        <input
          required
          placeholder="25 minutes + 5 minutes for questions"
          autofocus
          onKeyUp={(e) => {
            // If user presses enter, submit
            if (e.key === "Enter") {
              if (!finishTime()) {
                onStart();
              }
            }
          }}
          class="w-full rounded-lg bg-blue-200 p-2 shadow-inner dark:bg-blue-500"
          type="text"
          id="finishTime"
          value={textInputDurationInMinutes()}
          onInput={(e) => setTextInputDurationInMinutes(e.target.value)}
        />
      </div>
      <div class="flex w-full flex-wrap justify-between gap-2">
        <div class="flex gap-2">
          <button
            aria-label={"Undo"}
            class="btn px-4 py-2"
            onClick={() => undo()}
            disabled={undoStack.length === 0}
          >
            <LeftIcon />
          </button>
          <button
            aria-label={"Redo"}
            class="btn px-4 py-2"
            onClick={() => redo()}
            disabled={redoStack.length === 0}
          >
            <RightIcon />
          </button>
        </div>
        <div class="flex gap-2">
          <button
            aria-label={"Reset"}
            disabled={!finishTime()}
            class="px-4 py-2 hover:text-blue-900 active:text-blue-700 dark:hover:text-blue-100 dark:active:text-blue-300"
            onClick={onReset}
          >
            Reset
          </button>
          <button
            aria-label={"Start"}
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
