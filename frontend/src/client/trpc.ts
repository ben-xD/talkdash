import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";
import type { AppRouter } from "backend";
import { trpcWebsocketApiPath } from "backend";
import { createSignal } from "solid-js";

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "/";

const [isConnectedInternal, setIsConnected] = createSignal<boolean>(false);
export const isConnected = isConnectedInternal;

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    wsLink({
      client: createWSClient({
        url: backendUrl + trpcWebsocketApiPath,
        onOpen: () => {
          console.debug("tRPC websocket connected");
          setIsConnected(true);
        },
        onClose: () => {
          console.debug("tRPC websocket disconnected");
          setIsConnected(false);
        },
      }),
    }),
  ],
});
