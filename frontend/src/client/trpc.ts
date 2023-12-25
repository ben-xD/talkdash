import type { Navigator } from "@solidjs/router";
import {
  createTRPCProxyClient,
  createWSClient,
  loggerLink,
  TRPCClientError,
  wsLink,
} from "@trpc/client";
import type { AppRouter } from "@talkdash/backend";
import { trpcWebsocketApiPath } from "@talkdash/backend";
import { createEffect, createSignal } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";
import {
  audienceUsername,
  handleUpdateUsernameError,
  hostUsername,
  registeredUsername,
  setRegisteredUsername,
  speakerUsername,
  updateAudienceUsername,
  updateHostUsername,
  updateRegisteredUsername,
  updateSpeakerUsername,
} from "../features/user/userState.tsx";
import { Role } from "@talkdash/schema";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";
import { redirectToAuthenticateLink } from "./redirectToAuthenticateLink.ts";
import { env } from "./env.ts";

export const backendUrl = env.VITE_BACKEND_URL || "/";
const reconnectMessageDurationMs = 5000;

const [isConnectedInternal, setIsConnected] = createSignal<boolean>(false);
const [showReconnectedMessageInternal, setShowReconnectedMessage] =
  createSignal(false);
let disconnectedCount = 0;
export const showReconnectedMessage = showReconnectedMessageInternal;

export const isConnected = isConnectedInternal;

export const [bearerAuthToken, setBearerToken] = makePersisted(
  // we don't destructure because makePersisted wants the entire signal
  // eslint-disable-next-line solid/reactivity
  createSignal<string>(),
  {
    name: "session_id",
  },
);
export const isSignedIn = () => !!bearerAuthToken();

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

export const setPreferredUsername = async (role: Role, username?: string) => {
  if (!username) return;
  try {
    if (isSignedIn()) {
      await updateRegisteredUsername(username);
    } else {
      switch (role) {
        case "host":
          await updateHostUsername(username);
          break;
        case "audience":
          await updateAudienceUsername(username);
          break;
        case "speaker":
          await updateSpeakerUsername(username);
          break;
      }
    }
  } catch (e) {
    handleUpdateUsernameError(e);
  }
};

createEffect(() => {
  console.debug(`isSignedIn(): ${isSignedIn()}`);
});

// Ready if not logged in, or once websocket connection is authenticated
let websocketConnectionAuthResponsePromiseResolver:
  | ((value: void) => void)
  | undefined = undefined;

// Call this on onMount to wait for websocket connection to be authenticated if you're calling an protected route
export const isConnectionAuthenticatedWhenNeededPromise = new Promise<void>(
  (resolve) => {
    // This callback in promise constructor is called synchronously
    websocketConnectionAuthResponsePromiseResolver = resolve;
  },
);

// A signal so we can use the navigator once the app launches using links
// Then remove the special case for initial connection. `redirectToLoginWithRedirectBack`?
export const [navigatorSignal, setNavigatorSignal] = createSignal<Navigator>();

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    redirectToAuthenticateLink,
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
          const token = bearerAuthToken();
          if (token) {
            // To reproduce race condition of auth (try to authenticate too late), and other requests have been sent
            // await new Promise((resolve) => setTimeout(resolve, 5000));

            await trpc.auth.authenticateWebsocketConnection.mutate({
              bearerToken: token,
            });

            const reply = await trpc.auth.getRegisteredUsername.query({});
            setRegisteredUsername(reply);
            websocketConnectionAuthResponsePromiseResolver?.();
          } else {
            websocketConnectionAuthResponsePromiseResolver?.();
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
  await trpc.auth.signOut.mutate();
  setBearerToken(undefined);
  localStorage.clear();
  window.location.reload();
};

export const deleteAccount = async () => {
  await trpc.auth.deleteUser.mutate({});
  setBearerToken(undefined);
  localStorage.clear();
  window.location.reload();
};

export function isTRPCClientError(
  cause: unknown,
): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}

type TRPCClientErrorWithCode<T extends TRPC_ERROR_CODE_KEY> =
  TRPCClientError<AppRouter> & {
    cause: { data: { code: T } };
  };

// cause.data.code is "UNAUTHORIZED"
export function isTRPCClientAuthorizationError(
  cause: unknown,
): cause is TRPCClientErrorWithCode<"FORBIDDEN"> {
  return cause instanceof TRPCClientError && cause.data.code === "FORBIDDEN";
}

export function isTRPCClientAuthenticationError(
  cause: unknown,
): cause is TRPCClientErrorWithCode<"UNAUTHORIZED"> {
  return cause instanceof TRPCClientError && cause.data.code === "UNAUTHORIZED";
}
