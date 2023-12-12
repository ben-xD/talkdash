import { createSignal } from "solid-js";
import { trpc } from "../../client/trpc.ts";
import { TRPCClientError } from "@trpc/client";
import { toast } from "solid-toast";
import { Role } from "@talkdash/schema";

export const speakerUsernameKey = "speakerUsername";
export const hostUsernameKey = "hostUsername";
export const audienceUsernameKey = "audienceUsername";

export const [registeredUsername, setRegisteredUsername] = createSignal<
  string | undefined
>();

export const updateRegisteredUsername = async (
  username?: string,
): Promise<void> => {
  await trpc.auth.registerUsername.mutate({ newUsername: username });
  setRegisteredUsername(username);
};

// Unset them so they don't show up in query params or get used by anything
export const unsetTemporaryUsernames = (role: Role) => {
  switch (role) {
    case "host":
    case "audience":
      setHostUsernameInternal(undefined);
      setAudienceUsernameInternal(undefined);
      setQueryParam({
        key: hostUsernameKey,
        value: undefined,
        pushToHistory: false,
      });
      setQueryParam({
        key: audienceUsernameKey,
        value: undefined,
        pushToHistory: false,
      });
      break;
    case "speaker":
      setHostUsernameInternal(undefined);
      setAudienceUsernameInternal(undefined);
      setSpeakerUsernameInternal(undefined);
      setQueryParam({
        key: hostUsernameKey,
        value: undefined,
        pushToHistory: false,
      });
      setQueryParam({
        key: audienceUsernameKey,
        value: undefined,
        pushToHistory: false,
      });
      setQueryParam({
        key: speakerUsernameKey,
        value: undefined,
        pushToHistory: false,
      });
      break;
    default:
      return role satisfies never;
  }
};

// All of these are temporary
const [speakerUsernameInternal, setSpeakerUsernameInternal] = createSignal<
  string | undefined
>(undefined);
export const speakerUsername = speakerUsernameInternal;

export const [hostUsername, setHostUsernameInternal] = createSignal<
  string | undefined
>(undefined);

export const [audienceUsername, setAudienceUsernameInternal] = createSignal<
  string | undefined
>(undefined);

export const updateAudienceUsername = async (
  username?: string,
  pushToHistory: boolean = true,
): Promise<void> => {
  console.info(`Setting audience username to ${username}`);
  setAudienceUsernameInternal(username);
  setQueryParam({ key: audienceUsernameKey, value: username, pushToHistory });
  try {
    await trpc.auth.setTemporaryUsername.mutate({
      newUsername: username,
    });
  } catch (e) {
    if (e instanceof TRPCClientError) {
      const message = e.message;
      toast(() => (
        <p class="text-secondary-800">Failed to set username. {message}</p>
      ));
    } else {
      toast(() => (
        <p class="text-secondary-800">
          Failed to set username. Something went wrong.
        </p>
      ));
    }
  }
};

export const updateHostUsername = (
  username: string | undefined,
  pushToHistory: boolean = true,
): void => {
  console.info(`Setting host username to ${username}`);
  setHostUsernameInternal(username);
  setQueryParam({ key: hostUsernameKey, value: username, pushToHistory });
  // TODO check for logged in and a different procedure
  trpc.auth.setTemporaryUsername.mutate({ newUsername: username });
};

export const updateSpeakerUsername = (
  username?: string,
  pushToHistory = true,
) => {
  console.info(`Setting speaker username to ${username}`);
  // TODO check for logged in and a different procedure
  // TODO if this fails, don't update the rest, and throw an error instead
  trpc.auth.setTemporaryUsername.mutate({ newUsername: username });
  setSpeakerUsernameInternal(username);
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
