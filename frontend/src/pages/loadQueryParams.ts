import { setUsername, usernameKey } from "../features/user/userState.ts";
import { generateRandomUsername } from "../names.ts";

export const loadQueryParams = (generateFallbackUsername = true) => {
  // Read URL path param to get speaker ID.
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get(usernameKey);

  // if not found, create new speaker.
  if (!username && generateFallbackUsername) {
    setUsername(generateRandomUsername());
  } else {
    setUsername(username ?? "");
  }
};
