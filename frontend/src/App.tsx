import {TimeLeftDisplay} from "./features/time/TimeLeftDisplay.tsx";
import {createSignal, onMount} from "solid-js";
import {setCurrentTime, setFinishTime, setStartTime} from "./features/time/timeState.ts";
import {DateTime} from "luxon";
import {ElapsedTime} from "./features/time/ElapsedTime.tsx";


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
    <>
      <p class='text-2xl font-bold tracking-tight'>TalkDash</p>
      <div class="card">
        {/*TODO handle fuzzy input (e.g. 10 mins, 20 minutes, 1hr20m, average lifetime of an owl) */}
        <div class='flex flex-col items-start'>

        <label for='finishTime'>Duration (minutes)</label>
        <input type='text' id='finishTime' onInput={(e) => setDurationInMinutes(e.target.value)} />
        <button onClick={() => {
          const startTime = DateTime.now()

          const minutes = parseFloat(durationInMinutes());
          // TODO handle parseFloat error.
          const finishTime = startTime.plus({minutes});
          setStartTime(startTime);
          setFinishTime(finishTime);
        }}>
          Start
        </button>
        </div>
        <TimeLeftDisplay/>
        <ElapsedTime/>
        <div>
          <p>Recent messages</p>
        </div>
      </div>
    </>
  )
}

export default App
