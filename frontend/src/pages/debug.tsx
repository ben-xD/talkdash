import { onMount } from "solid-js";

const DebugPage = () => {
  onMount(() => {
    document.title = "Debug · TalkDash";
  });

  return (
    <div class="flex flex-col gap-4">
      <div class="flex justify-between">App build date: {__BUILD_DATE__}</div>
    </div>
  );
};

export default DebugPage;
