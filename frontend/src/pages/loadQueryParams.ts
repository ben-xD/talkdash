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
      setSpeakerUsername(speakerUsername ?? undefined, false);
      if (hostUsername) {
        setHostUsername(hostUsername, false);
      } else {
        setHostUsername(generateRandomUsername(), false);
      }
      return;
    case "audience":
      setSpeakerUsername(speakerUsername ?? undefined, false);
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
