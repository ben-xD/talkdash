import { MetadataView } from "../features/speaker/MetadataView.tsx";
import { ConfigCard } from "../features/ConfigCard.tsx";
import { TimeLeftDisplay } from "../features/time/TimeLeftDisplay.tsx";
import { MessageView } from "../features/messages/MessageView.tsx";
import { onMount } from "solid-js";
import { loadQueryParams } from "./loadQueryParams.ts";

const Speaker = () => {
  onMount(() => {
    document.title = "Speaker · Talkdash";
    loadQueryParams();
  });

  return (
    <div class="flex flex-col items-center">
      <div class="max-w-[400px] w-full flex flex-col items-stretch">
        <MetadataView />
        <div class="py-4 my-2 bg-blue-50 p-4 rounded-xl">
          <ConfigCard />
        </div>
      </div>
      <div class="my-2 flex justify-center">
        <TimeLeftDisplay />
      </div>
      <MessageView />
    </div>
  );
};
export default Speaker;
