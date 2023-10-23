import { createTRPCProxyClient, createWSClient, wsLink } from "@trpc/client";
import type { AppRouter } from "backend";
import { trpcWebsocketApiPath } from "backend";

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "/";

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    wsLink({
      client: createWSClient({
        url: backendUrl + trpcWebsocketApiPath,
        onOpen: () => console.debug("tRPC websocket connected"),
      }),
    }),
  ],
});
