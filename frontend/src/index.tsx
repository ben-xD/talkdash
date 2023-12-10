/* @refresh reload */
import { render } from "solid-js/web";

import "./css/index.css";
import "animate.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { ClockPage } from "./pages/clock.tsx";
import { StopwatchPage } from "./pages/stopwatch.tsx";
import { SignInPage } from "./pages/sign-in.tsx";
import { SignUpPage } from "./pages/sign-up.tsx";
import { OAuthCallbackPage } from "./pages/OAuthCallback.tsx";
import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

const root = document.getElementById("root");
if (!root) throw new Error("element with id root not found in index.html");

if (import.meta.env.DEV) {
  import("solid-devtools");
}

export const queryClient = new QueryClient();

const SpeakerPage = lazy(() => import("./pages/speaker.tsx"));
const AudiencePage = lazy(() => import("./pages/audience.tsx"));
const HomePage = lazy(() => import("./pages/home.tsx"));
const HostPage = lazy(() => import("./pages/host.tsx"));

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router root={App}>
        <Route path="/" component={HomePage} />
        <Route path="/audience" component={AudiencePage} />
        <Route path="/speaker" component={SpeakerPage} />
        <Route path="/host" component={HostPage} />
        <Route path="/clock" component={ClockPage} />
        <Route path="/stopwatch" component={StopwatchPage} />
        <Route path="/sign-in" component={SignInPage} />
        <Route path="/sign-up" component={SignUpPage} />
        <Route path="/auth/callback/:provider" component={OAuthCallbackPage} />
      </Router>
    </QueryClientProvider>
  ),
  root,
);
