import {
  audienceUsernameKey,
  hostUsernameKey,
  setAudienceUsername,
  setHostUsername,
  setSpeakerUsername,
  speakerUsernameKey,
} from "../features/user/userState.js";
import { generateRandomUsername } from "../features/names";
import { UserRole } from "@talkdash/schema";

export const loadQueryParams = (role: UserRole) => {
  // This function is called in Solid's onMount.
  // When users navigate from 1 page to another, `window.location` is not updated with the new page.
  // setTimeout ensures the window.location is updated with the new page.
  setTimeout(() => {
    loadQueryParamsPrivate(role);
  }, 0);
};

const loadQueryParamsPrivate = (role: UserRole) => {
  const urlParams = new URLSearchParams(window.location.search);
  const speakerUsername = urlParams.get(speakerUsernameKey);
  const hostUsername = urlParams.get(hostUsernameKey);
  const audienceUsername = urlParams.get(audienceUsernameKey);

  switch (role) {
    case "host":
      if (speakerUsername) setSpeakerUsername(speakerUsername, false);
      if (hostUsername) {
        setHostUsername(hostUsername, false);
      } else {
        setHostUsername(generateRandomUsername(), false);
      }
      return;
    case "audience":
      if (speakerUsername) setSpeakerUsername(speakerUsername, false);
      if (audienceUsername) {
        setAudienceUsername(audienceUsername, false);
      } else {
        setAudienceUsername(generateRandomUsername(), false);
      }
      return;
    case "speaker":
      if (speakerUsername) {
        setSpeakerUsername(speakerUsername, false);
      } else {
        setSpeakerUsername(generateRandomUsername(), false);
      }
      return;
    default:
      return role satisfies never;
  }
};
