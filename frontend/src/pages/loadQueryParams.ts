import {
  setSpeakerUsername,
  speakerUsernameKey,
} from "../features/user/userState.ts";
import { generateRandomUsername } from "../names.ts";

export const loadQueryParams = (generateFallbackUsername = true) => {
  // Read URL path param to get speaker ID.
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get(speakerUsernameKey);

  // if not found, create new speaker.
  if (!username && generateFallbackUsername) {
    setSpeakerUsername(generateRandomUsername());
  } else {
    setSpeakerUsername(username ?? "");
  }
};
