import { createSignal } from "solid-js";
import { trpc } from "../../client/trpcClient.ts";
import { Unsubscribable } from "@trpc/server/observable";

const [usernameInternal, setUsernameInternal] = createSignal<
  string | undefined
>(undefined);

export const usernameKey = "user";

export const username = usernameInternal;

const messageSubscriptions = new Set<Unsubscribable>();

export const setUsername = (name: string) => {
  if (username() !== name) {
    messageSubscriptions.forEach((handle) => handle.unsubscribe());
    const newSubscription = trpc.message.subscribeMessages.subscribe(
      { speakerUsername: name },
      { onData: ({ message }) => console.info(`Received message: ${message}`) },
    );
    messageSubscriptions.add(newSubscription);
  }

  setUsernameInternal(name);

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(usernameKey, name);
  const newUrl = new URL(window.location.toString());
  newUrl.search = urlParams.toString();
  window.history.pushState(null, "", newUrl);
};

export const [password, setPassword] = createSignal<string | undefined>(
  undefined,
);
