/* @refresh reload */
import { render } from "solid-js/web";

import "./css/index.css";
import "animate.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Route, Router } from "@solidjs/router";
import { DEV, lazy } from "solid-js";

import * as Sentry from "@sentry/browser";
import { env } from "./client/env.ts";

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
const AccountPage = lazy(() => import("./pages/account.tsx"));
const ClockPage = lazy(() => import("./pages/clock.tsx"));
const StopwatchPage = lazy(() => import("./pages/stopwatch.tsx"));
const SignInPage = lazy(() => import("./pages/sign-in.tsx"));
const SignUpPage = lazy(() => import("./pages/sign-up.tsx"));
const OAuthCallbackPage = lazy(() => import("./pages/OAuthCallback.tsx"));
const DebugPage = lazy(() => import("./pages/debug.tsx"));
const AboutPage = lazy(() => import("./pages/about.tsx"));

const setupSentry = () => {
  // this will only initialize your Sentry client in production builds.
  if (!DEV) {
    Sentry.init({
      dsn: env.VITE_SENTRY_DSN,
      integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,

      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [
        "localhost",
        /^https:\/\/talkdash\.orth\.uk\/api/,
      ],

      // Capture Replay for 10% of all sessions,
      // plus 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
};

setupSentry();
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
        <Route path="/account" component={AccountPage} />
        <Route path="/auth/callback/:provider" component={OAuthCallbackPage} />
        <Route path="/debug" component={DebugPage} />
        <Route path="/about" component={AboutPage} />
      </Router>
    </QueryClientProvider>
  ),
  root,
);
