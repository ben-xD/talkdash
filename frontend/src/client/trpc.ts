import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";
import type { AppRouter } from "backend";
import { trpcWebsocketApiPath } from "backend";
import { createEffect, createSignal } from "solid-js";
import { makePersisted } from "@solid-primitives/storage";

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "/";
const reconnectMessageDurationMs = 5000;

const [isConnectedInternal, setIsConnected] = createSignal<boolean>(false);
const [showReconnectedMessageInternal, setShowReconnectedMessage] =
  createSignal(false);
let disconnectedCount = 0;
export const showReconnectedMessage = showReconnectedMessageInternal;

export const isConnected = isConnectedInternal;

const [bearerToken, setBearerTokenInternal] = makePersisted(
  createSignal<string>(),
  {
    name: "session_id",
  },
);
export const isSignedIn = () => !!bearerToken();

createEffect(() => {
  console.debug(`isSignedIn(): ${isSignedIn()}`);
});

export const setBearerToken = setBearerTokenInternal;

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
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
