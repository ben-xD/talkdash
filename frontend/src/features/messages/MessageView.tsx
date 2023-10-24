import { createSignal, For, onCleanup } from "solid-js";
import { receivedMessages } from "./receivedMessages.ts";

export const MessageView = () => {
  return (
    <div class="flex flex-col items-center">
      <p class="font-bold tracking-tight">
        Recent messages ({receivedMessages.length})
      </p>
      <For each={receivedMessages}>
        {(message) => {
          const [timeSinceReceived, setTimeSinceReceived] = createSignal(
            message.receivedAt.toRelative(),
          );
          const interval = setInterval(() => {
            setTimeSinceReceived(message.receivedAt.toRelative());
          }, 1000);

          onCleanup(() => {
            clearInterval(interval);
          });

          return timeSinceReceived ? (
            <div class="flex gap-8">
              <p>{message.message}</p>
              <p>{timeSinceReceived()}</p>
            </div>
          ) : (
            <></>
          );
        }}
      </For>
    </div>
  );
};
