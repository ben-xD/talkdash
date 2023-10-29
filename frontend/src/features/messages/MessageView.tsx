import { createSignal, For, onCleanup } from "solid-js";
import { receivedMessages } from "./receivedMessages.js";

export const MessageView = () => {
  return (
    <div class="flex w-full flex-col items-center gap-4">
      <p class="font-bold tracking-tight">
        Recent messages ({receivedMessages.length})
      </p>
      <div class="flex w-full flex-col gap-4">
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
              <div class="flex w-full items-center justify-between gap-8 @container">
                <p class="whitespace-pre-wrap @lg:text-[4cqw]">
                  {message.emojiMessage
                    ? `${message.emojiMessage} ${message.message}`
                    : message.message}
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
