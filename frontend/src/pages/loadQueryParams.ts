import {
  hostUsernameKey,
  setHostUsername,
  setSpeakerUsername,
  speakerUsernameKey,
} from "../features/user/userState.js";
import { generateRandomUsername } from "../features/names";

export const loadQueryParams = (mode: "speaker" | "host") => {
  // Read URL path param to get speaker ID.
  const urlParams = new URLSearchParams(window.location.search);

  const speakerUsername = urlParams.get(speakerUsernameKey);
  if (speakerUsername) {
    setSpeakerUsername(speakerUsername, false);
  }

  const hostUsername = urlParams.get(hostUsernameKey);
  if (hostUsername) {
    setHostUsername(hostUsername, false);
  }

  // if not found, create new speaker
  if (!speakerUsername && mode === "speaker") {
    setSpeakerUsername(generateRandomUsername(), false);
  } else if (!hostUsername && mode === "host") {
    setHostUsername(generateRandomUsername(), false);
  } else {
    console.error("Unhandled mode: username not being set or generated");
    // setSpeakerUsername(username ?? "", false);
  }
};
