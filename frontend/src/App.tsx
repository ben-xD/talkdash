import { lazy, onMount, Show } from "solid-js";
import { setCurrentTime } from "./features/time/timeState.js";
import { DateTime } from "luxon";
import { Portal } from "solid-js/web";
import {
  Menu,
  MenuContent,
  MenuItem,
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

/* eslint-disable solid/no-react-specific-props */
//  because ARK-UI uses htmlFor. See https://github.com/chakra-ui/ark/issues/1601

const SpeakerPage = lazy(() => import("./pages/speaker.tsx"));
const AudiencePage = lazy(() => import("./pages/audience.tsx"));
const HomePage = lazy(() => import("./pages/home.tsx"));

const HostPage = lazy(() => import("./pages/host.tsx"));

function App() {
  onMount(() => {
    // Used to cause re-render of components that rely on current time.
    const intervalId = setInterval(() => {
      setCurrentTime(DateTime.now());
    });

    return () => clearInterval(intervalId);
  });

  const colors = () =>
    isExceeded()
      ? "bg-gradient-to-r from-amber-500 to-red-500 text-red-50"
      : "bg-gradient-to-r from-cyan-500 to-blue-500 text-blue-50";

  return (
    <div
      class={`min-w-[320px] p-4 ${colors()} flex min-h-screen flex-col items-center`}
    >
      <div class="flex items-center gap-4">
        <h1 class="text-center text-4xl font-bold tracking-tight">
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
                <MenuItemGroup id="modes" class="p">
                  {/*Margins/padding don't work on the label 😢 */}
                  <MenuItem id="speaker" class="px-4 py-2">
                    <A
                      class="text-slate-700 hover:text-slate-500"
                      href="/"
                      end
                      activeClass="text-blue-500 font-bold"
                    >
                      Home
                    </A>
                  </MenuItem>
                  <MenuItemGroupLabel
                    htmlFor="modes"
                    class="px-4 text-sm font-bold uppercase text-slate-500"
                  >
                    Modes
                  </MenuItemGroupLabel>
                  <MenuSeparator />
                  <MenuItem id="speaker" class="px-4 py-2">
                    <A
                      class="text-slate-700 hover:text-slate-500"
                      href="/speaker"
                      activeClass="text-blue-500 font-bold"
                    >
                      Speaker
                    </A>
                  </MenuItem>
                  <MenuItem id="host" class="px-4 py-2">
                    <A
                      class="text-slate-700 hover:text-slate-500"
                      href="/host"
                      activeClass="text-blue-500 font-bold"
                    >
                      Event Host
                    </A>
                  </MenuItem>
                  <MenuItem id="audience" class="px-4 py-2">
                    <A
                      class="text-slate-700 hover:text-slate-500"
                      href="/audience"
                      activeClass="text-blue-500 font-bold"
                    >
                      Audience
                    </A>
                  </MenuItem>
                  <MenuItemGroupLabel
                    htmlFor="modes"
                    class="px-4 text-sm font-bold uppercase text-slate-500"
                  >
                    Extras
                  </MenuItemGroupLabel>
                  <MenuSeparator />
                  <MenuItem id="clock" class="px-4 py-2">
                    <A
                      class="text-slate-700 hover:text-slate-500"
                      href="/clock"
                      activeClass="text-blue-500 font-bold"
                    >
                      Clock
                    </A>
                  </MenuItem>
                  <MenuItem id="Stopwatch" class="px-4 py-2">
                    <A
                      class="text-slate-700 hover:text-slate-500"
                      href="/stopwatch"
                      activeClass="text-blue-500 font-bold"
                    >
                      Stopwatch
                    </A>
                  </MenuItem>
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
