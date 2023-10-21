import {TimeLeftDisplay} from "./features/time/TimeLeftDisplay.tsx";
import {onMount} from "solid-js";
import {setCurrentTime} from "./features/time/timeState.ts";
import {DateTime} from "luxon";
import {MetadataView} from "./features/time/MetadataView.tsx";
import {MessageView} from "./features/messages/MessageView.tsx";
import {ConfigCard} from "./features/ConfigCard.tsx";
import {GithubLogo} from "./assets/GithubLogo.tsx";

function App() {

  onMount(() => {
    // Used to cause re-render of components that rely on current time.
    const intervalId = setInterval(() => {
      setCurrentTime(DateTime.now());
    })
    return () => clearInterval(intervalId);
  });

  return (
    <div class='p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-blue-50 flex flex-col items-center min-h-screen'>
      <div class='flex items-center'>
        <p class='text-4xl font-bold tracking-tight text-center px-4 py-2'>TalkDash</p>
        <a href='https://github.com/ben-xD/talkdash' target='_blank'>
          <GithubLogo/>
        </a>
      </div>
      <MetadataView/>
      <div class='py-4 my-2 bg-blue-50 p-4 rounded-xl'>
        <ConfigCard/>
      </div>
      <div class='my-2 flex'>
        <TimeLeftDisplay/>
      </div>
      <MessageView/>
    </div>
  )
}

export default App
