import { lazy, onMount } from "solid-js";
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
import { isExceeded } from "./features/time/TimeLeftDisplay.tsx";
import { GithubLogo } from "./assets/GithubLogo.tsx";
import { isConnected, showReconnectedMessage } from "./client/trpc.js";
import { DisconnectedAlert } from "./components/DisconnectedAlert.tsx";
import { ReconnectedAlert } from "./components/ReconnectedAlert.tsx";

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
      class={`min-w-[320px] p-4 ${colors()} flex flex-col items-center min-h-screen`}
    >
      <div class="flex items-center gap-4">
        <p class="text-4xl font-bold tracking-tight text-center">
          <A href="/">TalkDash</A>
        </p>
        <a href="https://github.com/ben-xD/talkdash" target="_blank">
          <GithubLogo />
        </a>
        <Menu>
          <MenuTrigger>
            <WrenchIcon />
          </MenuTrigger>
          <Portal>
            <MenuPositioner class="z-10">
              <MenuContent class="bg-white rounded-lg shadow-md">
                <MenuItemGroup id="modes" class="p">
                  {/*Margins/padding don't work on the label 😢 */}
                  <MenuItemGroupLabel
                    htmlFor="modes"
                    class="font-bold px-4 uppercase text-slate-500 text-sm"
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
                </MenuItemGroup>
              </MenuContent>
            </MenuPositioner>
          </Portal>
        </Menu>
      </div>
      {isConnected() && showReconnectedMessage() ? <ReconnectedAlert /> : <></>}
      {isConnected() || <DisconnectedAlert />}
      <Routes>
        <Route path="/" component={HomePage} />
        <Route path="/audience" component={AudiencePage} />
        <Route path="/speaker" component={SpeakerPage} />
        <Route path="/host" component={HostPage} />
      </Routes>
    </div>
  );
}

export default App;
