import { lazy, onMount, Show } from "solid-js";
import { setCurrentTime } from "./features/time/timeState";
import { DateTime } from "luxon";
import { A, Route, Routes } from "@solidjs/router";
import { isExceeded } from "./features/time/TimeLeft";
import { GithubLogo } from "./assets/GithubLogo";
import { DisconnectedAlert } from "./components/DisconnectedAlert";
import { ReconnectedAlert } from "./components/ReconnectedAlert";
import { ClockPage } from "./pages/clock";
import { StopwatchPage } from "./pages/stopwatch";
import { loadThemeOntoPage } from "./css/theme";
import { AppMenu } from "./components/Menu/AppMenu";
import { SignInPage } from "./pages/sign-in";
import { SignUpPage } from "./pages/sign-up";
import { isConnected, showReconnectedMessage } from "./client/trpc";

const SpeakerPage = lazy(() => import("./pages/speaker.tsx"));
const AudiencePage = lazy(() => import("./pages/audience.tsx"));
const HomePage = lazy(() => import("./pages/home.tsx"));

const HostPage = lazy(() => import("./pages/host.tsx"));

function App() {
  onMount(() => {
    loadThemeOntoPage();

    // Used to cause re-render of components that rely on current time.
    const intervalId = setInterval(() => {
      setCurrentTime(DateTime.now());
    });

    return () => clearInterval(intervalId);
  });

  const colors = () =>
    isExceeded()
      ? "bg-gradient-to-r from-amber-500 to-red-500 text-red-50 dark:from-gray-800 dark:to-gray-900 dark:text-gray-300"
      : "bg-gradient-to-r from-cyan-500 to-blue-500 text-blue-50 dark:from-gray-800 dark:to-gray-900 dark:text-gray-300";

  return (
    <div
      class={`min-w-[320px] p-4 ${colors()} flex min-h-screen flex-col items-center`}
    >
      <div class="flex items-center gap-4">
        <h1 class="text-center text-4xl font-bold tracking-tight dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 dark:bg-clip-text dark:text-transparent">
          <A href="/">TalkDash</A>
        </h1>
        <a
          href="https://github.com/ben-xD/talkdash"
          target="_blank"
          aria-label="Link to GitHub project"
        >
          <GithubLogo />
        </a>
        <AppMenu />
      </div>
      <Show when={!isConnected()}>
        <DisconnectedAlert />
      </Show>
      <Show when={isConnected() && showReconnectedMessage()}>
        <ReconnectedAlert />
      </Show>
      <Routes>
        <Route path="/" component={HomePage} />
        <Route path="/audience" component={AudiencePage} />
        <Route path="/speaker" component={SpeakerPage} />
        <Route path="/host" component={HostPage} />
        <Route path="/clock" component={ClockPage} />
        <Route path="/stopwatch" component={StopwatchPage} />
        <Route path="/sign-in" component={SignInPage} />
        <Route path="/sign-up" component={SignUpPage} />
      </Routes>
    </div>
  );
}

export default App;
