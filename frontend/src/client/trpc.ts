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
  hostUsername,
  registeredUsername,
  setRegisteredUsername,
  speakerUsername,
  unsetTemporaryUsernames,
  updateAudienceUsername,
  updateHostUsername,
  updateSpeakerUsername,
} from "../features/user/userState.tsx";
import { Role } from "@talkdash/schema";
import { TRPC_ERROR_CODE_KEY } from "@trpc/server/rpc";

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
  unsetTemporaryUsernames(role);
  if (registered) return setRegisteredUsername(username);

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
            // To reproduce race condition of auth (try to authenticate too late), and other requests have been sent
            // await new Promise((resolve) => setTimeout(resolve, 5000));

            try {
              await trpc.auth.authenticateWebsocketConnection.mutate({
                bearerToken: token,
              });
            } catch (e) {
              if (isTRPCClientAuthenticationError(e)) {
                console.error("Authentication failed, deleting credentials");
                setBearerToken(undefined);
              } else {
                console.error(
                  "Network request failed, not deleting credentials",
                  e,
                );
              }
            }

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
