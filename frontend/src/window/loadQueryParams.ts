import {
  audienceUsernameKey,
  hostUsernameKey,
  updateAudienceUsername,
  updateHostUsername,
  updateSpeakerUsername,
  speakerUsernameKey,
  registeredUsername,
} from "../features/user/userState.tsx";
import { generateRandomUsername } from "../features/names.ts";
import { UserRole } from "@talkdash/schema";
import { isConnectionAuthenticatedWhenNeededPromise } from "../client/trpc.ts";

export const loadQueryParams = async (role: UserRole) => {
  const registeredName = registeredUsername();
  if (registeredName) return;
  await isConnectionAuthenticatedWhenNeededPromise;

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
