import { setUsername, usernameKey } from "../features/user/userState.ts";
import { generateRandomUsername } from "../names.ts";

export const loadQueryParams = () => {
  // Read URL path param to get speaker ID.
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get(usernameKey);

  // if not found, create new speaker.
  if (!username) {
    setUsername(generateRandomUsername());
  } else {
    setUsername(username);
  }
};
