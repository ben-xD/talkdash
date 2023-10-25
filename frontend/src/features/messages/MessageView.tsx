import { createSignal, For, onCleanup } from "solid-js";
import { receivedMessages } from "./receivedMessages.ts";

export const MessageView = () => {
  return (
    <div class="flex flex-col items-center w-full gap-4">
      <p class="font-bold tracking-tight">
        Recent messages ({receivedMessages.length})
      </p>
      <div class="flex flex-col w-full gap-4">
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
              <div class="flex gap-8 @container justify-between w-full items-center">
                <p class="@lg:text-[4cqw] whitespace-pre-wrap">
                  {message.emojiMessage} {message.message}
                </p>
                <p class="text-right">{timeSinceReceived()}</p>
              </div>
            ) : (
              <></>
            );
          }}
        </For>
      </div>
    </div>
  );
};
