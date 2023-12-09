import { createSignal } from "solid-js";
import { trpc } from "../../client/trpc.ts";

const [usernameInternal, setUsernameInternal] = createSignal<
  string | undefined
>(undefined);

export const speakerUsernameKey = "speakerUsername";
export const hostUsernameKey = "hostUsername";
export const audienceUsernameKey = "audienceUsername";

export const speakerUsername = usernameInternal;

export const [hostUsername, setHostUsernameInternal] = createSignal<
  string | undefined
>(undefined);

export const [audienceUsername, setAudienceUsernameInternal] = createSignal<
  string | undefined
>(undefined);

export const setAudienceUsername = (
  username?: string,
  pushToHistory: boolean = true,
): void => {
  console.info(`Setting audience username to ${username}`);
  setAudienceUsernameInternal(username);
  setQueryParam({ key: audienceUsernameKey, value: username, pushToHistory });
  trpc.sender.setUsername.mutate({ newUsername: username, role: "audience" });
};

export const setHostUsername = (
  username: string | undefined,
  pushToHistory: boolean = true,
): void => {
  console.info(`Setting host username to ${username}`);
  setHostUsernameInternal(username);
  setQueryParam({ key: hostUsernameKey, value: username, pushToHistory });
  trpc.sender.setUsername.mutate({ newUsername: username, role: "host" });
};

export const setSpeakerUsername = (username?: string, pushToHistory = true) => {
  console.info(`Setting speaker username to ${username}`);
  setUsernameInternal(username);
  setQueryParam({ key: speakerUsernameKey, value: username, pushToHistory });
};

const setQueryParam = ({
  key,
  value,
  pushToHistory,
}: {
  key: string;
  value?: string;
  pushToHistory: boolean;
}) => {
  const urlParams = new URLSearchParams(window.location.search);
  if (value) {
    urlParams.set(key, value);
  } else {
    urlParams.delete(key);
  }

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
