import { MetadataView } from "../features/speaker/MetadataView.tsx";
import { ConfigCard } from "../features/ConfigCard.tsx";
import { TimeLeftDisplay } from "../features/time/TimeLeftDisplay.tsx";
import { MessageView } from "../features/messages/MessageView.tsx";
import { onMount } from "solid-js";
import { generateRandomUsername } from "../names.ts";
import { setUsername, usernameKey } from "../features/user/userState.ts";

const Speaker = () => {
  onMount(() => {
    document.title = "Speaker · Talkdash";

    // Read URL path param to get speaker ID.
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get(usernameKey);

    // if not found, create new speaker.
    if (!username) {
      setUsername(generateRandomUsername());
    } else {
      setUsername(username);
    }
  });

  return (
    <div class="flex flex-col items-center">
      <MetadataView />
      <div class="py-4 my-2 bg-blue-50 p-4 rounded-xl">
        <ConfigCard />
      </div>
      <div class="my-2 flex">
        <TimeLeftDisplay />
      </div>
      <MessageView />
    </div>
  );
};
export default Speaker;
