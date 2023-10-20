import {TimeLeftDisplay} from "./features/time/TimeLeftDisplay.tsx";
import {createSignal, onMount} from "solid-js";
import {setCurrentTime, setFinishTime, setStartTime} from "./features/time/timeState.ts";
import {DateTime} from "luxon";
import {MetadataView} from "./features/time/MetadataView.tsx";
import {MessageView} from "./features/messages/MessageView.tsx";


function App() {

  const [durationInMinutes, setDurationInMinutes] = createSignal('');

  onMount(() => {
    // Used to cause re-render of components that rely on current time.
    const intervalId = setInterval(() => {
      setCurrentTime(DateTime.now());
    })
    return () => clearInterval(intervalId);
  });

  return (
    <div class='p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-blue-50 flex flex-col items-center min-h-screen'>
      <p class='text-4xl font-bold tracking-tight text-center px-4 py-2'>TalkDash</p>
      <MetadataView/>
      <div class='py-4 my-2 bg-blue-50 p-4 rounded-xl'>
        {/*TODO handle fuzzy input (e.g. 10 mins, 20 minutes, 1hr20m, average lifetime of an owl) */}
        <div class='flex flex-col items-start gap-8 text-cyan-800'>
          <div class='flex flex-col gap-2'>
            <label for='finishTime'>Duration (minutes)</label>
            <input placeholder='20' autofocus class='bg-blue-200 rounded-lg px-2' type='text' id='finishTime'
                   onInput={(e) => setDurationInMinutes(e.target.value)}/>
          </div>
          <div class='flex gap-2 text-blue-50 w-full justify-end'>
            <button class='bg-green-600 px-4 py-2 rounded-md' onClick={() => {
              const startTime = DateTime.now()

              const minutes = parseFloat(durationInMinutes());
              // TODO handle parseFloat error.
              const finishTime = startTime.plus({minutes});
              setStartTime(startTime);
              setFinishTime(finishTime);
            }}>
              Start
            </button>
            <button class='bg-red-600 px-4 py-2 rounded-md' onClick={() => {
              setStartTime(undefined);
              setFinishTime(undefined);
            }}>Reset
            </button>
          </div>
        </div>
      </div>
      <div class='my-2'>
      <TimeLeftDisplay/>
      </div>
      <MessageView/>
    </div>
  )
}

export default App
