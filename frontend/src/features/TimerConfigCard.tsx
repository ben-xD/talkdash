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
import { RightIcon } from "../assets/RightIcon";
import { LeftIcon } from "../assets/LeftIcon";
import { createSignal } from "solid-js";
import { Alert } from "../components/Alert";
import { trpc } from "../client/trpc";
import { Card } from "../components/Card";
import { cn } from "../css/tailwind.ts";

export function TimerConfigCard(props: { class?: string }) {
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
    <Card class={cn("my-2 p-4", props.class)}>
      <div class="flex flex-col gap-2">
        <Alert message={errorMessage()} />
        <label class="whitespace-normal break-words" for="finishTime">
          Talk length
          <p class="text-primary-600 dark:text-primary-400">
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
          class="input"
          type="text"
          id="finishTime"
          value={textInputDurationInMinutes()}
          onInput={(e) => setTextInputDurationInMinutes(e.target.value)}
        />
      </div>
      <div class="flex flex-wrap justify-between gap-2">
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
            class="px-4 py-2 hover:text-primary-900 active:text-primary-700 dark:hover:text-primary-100 dark:active:text-primary-300"
            onClick={onReset}
          >
            Reset
          </button>
          <button
            aria-label={"Start"}
            disabled={!!finishTime() || !textInputDurationInMinutes()}
            class="rounded-md bg-primary-600 px-4 py-2 text-primary-50 shadow hover:bg-primary-500 active:bg-primary-700 disabled:bg-gray-400"
            onClick={onStart}
          >
            Start
          </button>
        </div>
      </div>
    </Card>
  );
}
