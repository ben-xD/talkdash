import {createSignal} from "solid-js";

const [usernameInternal, setUsernameInternal] = createSignal<string | undefined>(undefined);

export const usernameKey = 'user';

export const username = usernameInternal;
export const setUsername = (name: string) => {
  setUsernameInternal(name);

  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set(usernameKey, name);
  const newUrl = new URL(window.location.toString());
  newUrl.search = urlParams.toString();
  window.history.pushState(null, '', newUrl)
};

export const [password, setPassword] = createSignal<string | undefined>(undefined);