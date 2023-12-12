import {
  createTRPCProxyClient,
  createWSClient,
  loggerLink,
  wsLink,
} from "@trpc/client";
import type { AppRouter } from "@talkdash/backend";
import { trpcWebsocketApiPath } from "@talkdash/backend";
import { createEffect, createSignal } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import {
  audienceUsername,
  hostUsername,
  registeredUsername,
  speakerUsername,
  setRegisteredUsername,
  updateAudienceUsername,
  updateHostUsername,
  updateSpeakerUsername,
} from "../features/user/userState.tsx";
import { Role } from "@talkdash/schema";

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "/";
const reconnectMessageDurationMs = 5000;

const [isConnectedInternal, setIsConnected] = createSignal<boolean>(false);
const [showReconnectedMessageInternal, setShowReconnectedMessage] =
  createSignal(false);
let disconnectedCount = 0;
export const showReconnectedMessage = showReconnectedMessageInternal;

export const isConnected = isConnectedInternal;

const [bearerToken, setBearerTokenInternal] = makePersisted(
  // we don't destructure because makePersisted wants the entire signal
  // eslint-disable-next-line solid/reactivity
  createSignal<string>(),
  {
    name: "session_id",
  },
);
export const isSignedIn = () => !!bearerToken();

export const preferredUsername = (role: Role) => {
  const registered = registeredUsername();
  if (registered) return registered;

  switch (role) {
    case "host":
      return hostUsername();
    case "audience":
      return audienceUsername();
    case "speaker":
      return speakerUsername();
  }
};

export const setPreferredUsername = (role: Role, username: string) => {
  const registered = registeredUsername();
  if (registered) setRegisteredUsername(username);

  switch (role) {
    case "host":
      updateHostUsername(username);
      break;
    case "audience":
      updateAudienceUsername(username);
      break;
    case "speaker":
      updateSpeakerUsername(username);
      break;
  }
};

createEffect(() => {
  console.debug(`isSignedIn(): ${isSignedIn()}`);
});

export const setBearerToken = setBearerTokenInternal;

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        (import.meta.env.DEV && typeof window !== "undefined") ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    wsLink({
      client: createWSClient({
        url: backendUrl + trpcWebsocketApiPath,
        onOpen: async () => {
          console.debug("tRPC websocket connected");
          setIsConnected(true);
          if (disconnectedCount > 0) {
            setShowReconnectedMessage(true);
            setTimeout(() => {
              setShowReconnectedMessage(false);
            }, reconnectMessageDurationMs);
          }

          // Send the bearer token if it exists to authenticate the websocket connection as soon as possible.
          const token = bearerToken();
          if (token) {
            await trpc.auth.authenticateWebsocketConnection.mutate({
              bearerToken: token,
            });
          }

          // Get username if signed in
          const signedIn = isSignedIn();
          if (signedIn) {
            const reply = await trpc.auth.getUsername.query({});
            setRegisteredUsername(reply);
          }
        },
        onClose: () => {
          disconnectedCount += 1;
          console.error("tRPC websocket disconnected");
          setIsConnected(false);
        },
      }),
    }),
  ],
});

export const signOut = async () => {
  setBearerToken(undefined);
  await trpc.auth.signOut.mutate();
  window.location.reload();
};
