import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";
import type { AppRouter } from "backend";
import { trpcWebsocketApiPath } from "backend";
import { createSignal } from "solid-js";

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "/";
const reconnectMessageDurationMs = 5000;

const [isConnectedInternal, setIsConnected] = createSignal<boolean>(false);
const [showReconnectedMessageInternal, setShowReconnectedMessage] =
  createSignal(false);
let disconnectedCount = 0;
export const showReconnectedMessage = showReconnectedMessageInternal;

export const isConnected = isConnectedInternal;

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    wsLink({
      client: createWSClient({
        url: backendUrl + trpcWebsocketApiPath,
        onOpen: () => {
          console.debug("tRPC websocket connected");
          setIsConnected(true);
          if (disconnectedCount > 0) {
            setShowReconnectedMessage(true);
            setTimeout(() => {
              setShowReconnectedMessage(false);
            }, reconnectMessageDurationMs);
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
