import {
  audienceUsernameKey,
  hostUsernameKey,
  updateAudienceUsername,
  updateHostUsername,
  updateSpeakerUsername,
  speakerUsernameKey,
} from "../features/user/userState.tsx";
import { generateRandomUsername } from "../features/names.ts";
import { UserRole } from "@talkdash/schema";

export const loadQueryParams = (role: UserRole) => {
  const urlParams = new URLSearchParams(window.location.search);
  const speakerUsername = urlParams.get(speakerUsernameKey);
  const hostUsername = urlParams.get(hostUsernameKey);
  const audienceUsername = urlParams.get(audienceUsernameKey);

  switch (role) {
    case "host":
      if (speakerUsername) updateSpeakerUsername(speakerUsername, false);
      if (hostUsername) {
        updateHostUsername(hostUsername, false);
      } else {
        updateHostUsername(generateRandomUsername(), false);
      }
      return;
    case "audience":
      if (speakerUsername) updateSpeakerUsername(speakerUsername, false);
      if (audienceUsername) {
        updateAudienceUsername(audienceUsername, false);
      } else {
        updateAudienceUsername(generateRandomUsername(), false);
      }
      return;
    case "speaker":
      if (speakerUsername) {
        updateSpeakerUsername(speakerUsername, false);
      } else {
        updateSpeakerUsername(generateRandomUsername(), false);
      }
      return;
    default:
      return role satisfies never;
  }
};
