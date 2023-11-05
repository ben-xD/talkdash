import { lazy, onMount, Show } from "solid-js";
import { setCurrentTime } from "./features/time/timeState.js";
import { DateTime } from "luxon";
import { Portal } from "solid-js/web";
import {
  Menu,
  MenuContent,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuPositioner,
  MenuSeparator,
  MenuTrigger,
} from "@ark-ui/solid";
import { A, Route, Routes } from "@solidjs/router";
import { WrenchIcon } from "./assets/WrenchIcon.jsx";
import { isExceeded } from "./features/time/TimeLeft.tsx";
import { GithubLogo } from "./assets/GithubLogo.tsx";
import { isConnected, showReconnectedMessage } from "./client/trpc.js";
import { DisconnectedAlert } from "./components/DisconnectedAlert.tsx";
import { ReconnectedAlert } from "./components/ReconnectedAlert.tsx";
import { ClockPage } from "./pages/clock.tsx";
import { StopwatchPage } from "./pages/stopwatch.tsx";
import { loadThemeOntoPage } from "./css/theme.ts";
import { ThemeMenu } from "./components/Menu/ThemeMenu.tsx";
import { MenuItemLink } from "./components/Menu/MenuItemLink.tsx";

/* eslint-disable solid/no-react-specific-props */
//  because ARK-UI uses htmlFor. See https://github.com/chakra-ui/ark/issues/1601

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
        <Menu>
          <MenuTrigger aria-label={"Navigation menu"}>
            <WrenchIcon />
          </MenuTrigger>
          <Portal>
            <MenuPositioner class="z-10">
              <MenuContent class="rounded-lg bg-white shadow-md">
                <MenuItemGroup id="modes">
                  {/*Margins/padding don't work on the label 😢 */}
                  <MenuItemLink path="/" title={"Home"} exactPath />
                  <MenuItemGroupLabel
                    htmlFor="modes"
                    class="px-4 text-sm font-bold uppercase text-slate-500"
                  >
                    Modes
                  </MenuItemGroupLabel>
                  <MenuSeparator />
                  <MenuItemLink path="/speaker" title={"Speaker"} />
                  <MenuItemLink path="/host" title={"Event Host"} />
                  <MenuItemLink path="/audience" title={"Audience"} />
                  <MenuItemGroupLabel
                    htmlFor="modes"
                    class="px-4 text-sm font-bold uppercase text-slate-500"
                  >
                    Extras
                  </MenuItemGroupLabel>
                  <MenuSeparator />
                  <MenuItemLink path="/clock" title={"Clock"} />
                  <MenuItemLink path="/stopwatch" title={"Stopwatch"} />
                  <ThemeMenu />
                </MenuItemGroup>
              </MenuContent>
            </MenuPositioner>
          </Portal>
        </Menu>
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
      </Routes>
    </div>
  );
}

export default App;
