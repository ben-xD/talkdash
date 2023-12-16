import {
  audienceUsernameKey,
  hostUsernameKey,
  updateAudienceUsername,
  updateHostUsername,
  updateSpeakerUsername,
  speakerUsernameKey,
  updateSubscribedSpeakerUsername,
} from "../features/user/userState.tsx";
import { generateRandomUsername } from "../features/names.ts";
import { UserRole } from "@talkdash/schema";
import {
  isConnectionAuthenticatedWhenNeededPromise,
  isSignedIn,
} from "../client/trpc.ts";

export const loadQueryParams = async (role: UserRole) => {
  const urlParams = new URLSearchParams(window.location.search);
  const speakerUsername = urlParams.get(speakerUsernameKey);
  const hostUsername = urlParams.get(hostUsernameKey);
  const audienceUsername = urlParams.get(audienceUsernameKey);

  if (isSignedIn()) {
    if (role !== "speaker" && speakerUsername) {
      updateSubscribedSpeakerUsername(speakerUsername);
    }
    return;
  }

  await isConnectionAuthenticatedWhenNeededPromise;
  switch (role) {
    case "host":
      if (speakerUsername) await updateSpeakerUsername(speakerUsername, false);
      if (hostUsername) {
        await updateHostUsername(hostUsername, false);
      } else {
        await updateHostUsername(generateRandomUsername(), false);
      }
      return;
    case "audience":
      if (speakerUsername) await updateSpeakerUsername(speakerUsername, false);
      if (audienceUsername) {
        await updateAudienceUsername(audienceUsername, false);
      } else {
        await updateAudienceUsername(generateRandomUsername(), false);
      }
      return;
    case "speaker":
      if (speakerUsername) {
        await updateSpeakerUsername(speakerUsername, false);
      } else {
        await updateSpeakerUsername(generateRandomUsername(), false);
      }
      return;
    default:
      return role satisfies never;
  }
};
