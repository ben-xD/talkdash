import { createSignal, For, onCleanup, Show } from "solid-js";
import {
  ReceivedMessage,
  receivedMessages,
  setReceivedMessages,
} from "./receivedMessages";
import { TrashIcon } from "../../assets/TrashIcon";
import { isAudienceMessagesShown } from "../speaker/audienceMessages.ts";
import { showTimeReminderMessages } from "../time/timeState.ts";

export const MessageView = () => {
  const showMessage = (message: ReceivedMessage) => {
    if (message.sender.role === "audience") {
      return isAudienceMessagesShown();
    } else if (message.sender.role === "bot") {
      return showTimeReminderMessages();
    }
    return true;
  };

  const shownMessages = () => receivedMessages.filter(showMessage);
  const hiddenMessageCount = () =>
    receivedMessages.length - shownMessages().length;

  return (
    <div class="flex w-full flex-col items-center">
      <div class="flex items-center gap-8">
        <h2 class="font-bold tracking-tight">
          Messages ({shownMessages().length}
          {hiddenMessageCount() > 0 && `, ${hiddenMessageCount()} hidden`})
        </h2>
        <TrashIcon
          class="hover:text-primary-100 h-12 w-12 p-3 active:text-white"
          onClick={() => setReceivedMessages([])}
        />
      </div>
      <div class="flex w-full flex-col gap-4">
        <For each={shownMessages()}>
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
                <div class="animate__animated animate__jackInTheBox @container flex w-full items-center justify-between gap-8">
                  <p class="whitespace-pre-wrap @lg:text-[4cqw]">
                    {message.emojiMessage
                      ? `${message.emojiMessage.replace("\n", "").trim()} ${
                          message.message
                        }`
                      : message.message}
                  </p>
                  <div class="flex items-center gap-8">
                    <div class="flex flex-col items-end">
                      <p class="text-right">{timeSinceReceived()}</p>
                      {message.sender && (
                        <p>
                          from {message.sender.role}{" "}
                          <span class="font-bold">
                            {message.sender.username}
                          </span>
                        </p>
                      )}
                    </div>
                    <TrashIcon
                      class={
                        "hover:text-primary-100 h-12 w-12 p-3 active:text-white"
                      }
                      onClick={() =>
                        setReceivedMessages((messages) =>
                          messages.filter((m) => m.message !== message.message),
                        )
                      }
                    />
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
