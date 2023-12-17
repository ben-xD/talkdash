import { isConnected, showReconnectedMessage } from "../client/trpc.ts";
import { Show } from "solid-js";

export const ReconnectedAlert = () => {
  return (
    <Show when={isConnected() && showReconnectedMessage()}>
      <div
        class="mt-4 flex items-center rounded-full bg-green-200 p-2 leading-none text-green-600 lg:inline-flex"
        role="alert"
      >
        <span class="mr-3 flex rounded-full bg-green-600 px-2 py-1 text-xs font-bold uppercase text-white">
          Connected
        </span>
        <span class="mr-2 flex-auto text-left font-semibold">
          You're back online
        </span>
      </div>
    </Show>
  );
};
