import {createSignal} from "solid-js";
import {finishTime, setFinishTime, setStartTime} from "./time/timeState.ts";
import {DateTime} from "luxon";


export function ConfigCard() {
  const [durationInMinutes, setDurationInMinutes] = createSignal('');

  return <div class='flex flex-col items-start gap-8 text-cyan-800 z-10 relative'>
    <div class='flex flex-col gap-2'>
      <label for='finishTime'>Talk length (minutes)*</label>
      <input required placeholder='20.5' autofocus class='bg-blue-200 rounded-lg px-2' type='text' id='finishTime'
             onInput={(e) => setDurationInMinutes(e.target.value)}/>
    </div>
    <div class='flex gap-2 text-blue-50 w-full justify-end'>
      <button disabled={!!finishTime()} class='bg-green-600 px-4 py-2 rounded-md disabled:bg-gray-500'
              onClick={() => {
                const startTime = DateTime.now()

                const minutes = parseFloat(durationInMinutes());
                // TODO handle parseFloat error.
                const finishTime = startTime.plus({minutes});
                setStartTime(startTime);
                setFinishTime(finishTime);
              }}>
        Start
      </button>
      <button disabled={!finishTime()} class='bg-red-600 disabled:bg-gray-500 px-4 py-2 rounded-md'
              onClick={() => {
                setStartTime(undefined);
                setFinishTime(undefined);
              }}>Reset
      </button>
    </div>
  </div>;
}