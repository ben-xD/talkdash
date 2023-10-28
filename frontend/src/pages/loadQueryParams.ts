import {
  setSpeakerUsername,
  speakerUsernameKey,
} from "../features/user/userState.js";
import { generateRandomUsername } from "../names.js";

export const loadQueryParams = (generateFallbackUsername = true) => {
  // Read URL path param to get speaker ID.
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get(speakerUsernameKey);

  // if not found, create new speaker.
  if (!username && generateFallbackUsername) {
    setSpeakerUsername(generateRandomUsername(), false);
  } else {
    setSpeakerUsername(username ?? "", false);
  }
};
