import { onCleanup, onMount } from "solid-js";
import { capturePageLeave, capturePageView } from "../AnalyticsEvents.ts";

const DebugPage = () => {
  onMount(() => {
    document.title = "Debug · TalkDash";
    capturePageView();
    onCleanup(capturePageLeave);
  });

  return (
    <div class="flex flex-col gap-4">
      <div class="flex justify-between">App build date: {__BUILD_DATE__}</div>
    </div>
  );
};

export default DebugPage;
