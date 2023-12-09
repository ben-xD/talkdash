import { createSignal } from "solid-js";
import { trpc } from "../../client/trpc.ts";

const [usernameInternal, setUsernameInternal] = createSignal<
  string | undefined
>(undefined);

export const speakerUsernameKey = "speakerUsername";
export const hostUsernameKey = "hostUsername";

export const speakerUsername = usernameInternal;

export const [hostUsername, setHostUsernameInternal] = createSignal<
  string | undefined
>(undefined);

export const setHostUsername = (
  username: string,
  pushToHistory: boolean = true,
): void => {
  setHostUsernameInternal(username);
  setQueryParam({ key: hostUsernameKey, value: username, pushToHistory });

  // TODO await?
  trpc.host.setUsername.mutate({ newUsername: username });
};

export const setSpeakerUsername = (name: string, pushToHistory = true) => {
  setUsernameInternal(name);
  setQueryParam({ key: speakerUsernameKey, value: name, pushToHistory });
};

const setQueryParam = ({
  key,
  value,
  pushToHistory,
}: {
  key: string;
  value: string;
  pushToHistory: boolean;
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(key, value);
  const newUrl = new URL(window.location.toString());
  newUrl.search = urlParams.toString();
  if (pushToHistory) {
    window.history.pushState(null, "", newUrl);
  } else {
    window.history.replaceState(null, "", newUrl);
  }
};

export const [password, setPassword] = createSignal<string | undefined>(
  undefined,
);
