import { JSX, onMount, Show } from "solid-js";
import { setCurrentTime } from "./features/time/timeState";
import { DateTime } from "luxon";
import { A } from "@solidjs/router";
import { isExceeded } from "./features/time/TimeLeft";
import { GithubLogo } from "./assets/GithubLogo";
import { DisconnectedAlert } from "./components/DisconnectedAlert";
import { ReconnectedAlert } from "./components/ReconnectedAlert";
import { loadThemeOntoPage } from "./css/theme";
import { AppMenu } from "./components/Menu/AppMenu";
import { isConnected, showReconnectedMessage } from "./client/trpc";

function App(props: { children?: JSX.Element }) {
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
      ? "bg-gradient-to-r from-dangerSecondary-500 to-danger-500 text-danger-50 dark:from-gray-800 dark:to-gray-900 dark:text-primary-100"
      : "bg-gradient-to-r from-secondary-500 to-bg-500 text-primary-50 dark:from-gray-800 dark:to-gray-900 dark:text-primary-100";

  return (
    <div
      class={`min-w-[320px] p-4 ${colors()} flex min-h-screen flex-col items-center`}
    >
      <div class="flex items-center gap-4">
        <h1 class="text-center text-4xl font-bold tracking-tight dark:bg-gradient-to-r dark:from-secondary-400 dark:to-primary-500 dark:bg-clip-text dark:text-transparent">
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
      <div class="my-4">{props.children}</div>
    </div>
  );
}

export default App;
