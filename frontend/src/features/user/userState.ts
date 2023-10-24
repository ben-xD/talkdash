import { createSignal } from "solid-js";

const [usernameInternal, setUsernameInternal] = createSignal<
  string | undefined
>(undefined);

export const speakerUsernameKey = "speakerUsername";

export const speakerUsername = usernameInternal;

export const setSpeakerUsername = (name: string) => {
  setUsernameInternal(name);

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(speakerUsernameKey, name);
  const newUrl = new URL(window.location.toString());
  newUrl.search = urlParams.toString();
  window.history.pushState(null, "", newUrl);
};

export const [password, setPassword] = createSignal<string | undefined>(
  undefined,
);
