import posthog from "posthog-js";
import { env } from "./client/env.ts";

export const setupPostHog = () => {
  posthog.init(env.VITE_POSTHOG_CLIENT_TOKEN, {
    // Cookies are not used, so a cookie banner is not necessary
    persistence: "sessionStorage",
  });
};

export type AnalyticsEventsPayloadByName = {
  pageLoad: {
    page: string;
  };
};

export type AnalyticsEvents = keyof AnalyticsEventsPayloadByName;
type Payload<T extends AnalyticsEvents> = AnalyticsEventsPayloadByName[T];

export const captureAnalyticsEvent = <T extends AnalyticsEvents>(
  name: T,
  payload: Payload<T>,
) => {
  posthog.capture(name, payload);
};

// As per https://posthog.com/docs/data/events
export const capturePageView = () => posthog.capture("$pageview");
export const capturePageLeave = () => posthog.capture("$pageleave");

// For example:
// captureEvent("navigation", {page: "home"});
