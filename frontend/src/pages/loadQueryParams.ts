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
  const urlParams = new URLSearchParams(window.location.search);
  const speakerUsername = urlParams.get(speakerUsernameKey);
  const hostUsername = urlParams.get(hostUsernameKey);
  const audienceUsername = urlParams.get(audienceUsernameKey);

  switch (role) {
    case "host":
      if (hostUsername) {
        setSpeakerUsername(speakerUsername ?? undefined, false);
        setHostUsername(hostUsername, false);
      } else {
        setHostUsername(generateRandomUsername(), false);
      }
      return;
    case "audience":
      if (audienceUsername) {
        setSpeakerUsername(speakerUsername ?? undefined, false);
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
