import { createSignal, For, onCleanup, Show } from "solid-js";
import { receivedMessages, setReceivedMessages } from "./receivedMessages.js";
import { TrashIcon } from "../../assets/TrashIcon.tsx";

export const MessageView = () => {
  return (
    <div class="flex w-full flex-col items-center gap-4">
      <div class="flex gap-8">
        <h2 class="font-bold tracking-tight">
          Messages ({receivedMessages.length})
        </h2>
        <div
          class="hover:text-blue-100 active:text-white"
          onClick={() => setReceivedMessages([])}
        >
          <TrashIcon />
        </div>
      </div>
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

            return (
              <Show when={timeSinceReceived()}>
                <div class="flex w-full items-center justify-between gap-8 @container">
                  <p class="whitespace-pre-wrap @lg:text-[4cqw]">
                    {message.emojiMessage
                      ? `${message.emojiMessage} ${message.message}`
                      : message.message}
                  </p>
                  <div class="flex gap-8 hover:text-blue-100 active:text-white">
                    <p class="text-right">{timeSinceReceived()}</p>
                    <div
                      onClick={() =>
                        setReceivedMessages((messages) =>
                          messages.filter((m) => m.message !== message.message),
                        )
                      }
                    >
                      <TrashIcon />
                    </div>
                  </div>
                </div>
              </Show>
            );
          }}
        </For>
      </div>
    </div>
  );
};
