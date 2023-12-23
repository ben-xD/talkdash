import { createEffect, onCleanup, onMount } from "solid-js";
import { deleteAccount, isSignedIn } from "../client/trpc.ts";
import { useNavigate } from "@solidjs/router";
import { capturePageLeave, capturePageView } from "../AnalyticsEvents.ts";

const AccountPage = () => {
  const navigate = useNavigate();

  onMount(() => {
    document.title = "Account · TalkDash";
    capturePageView();
    onCleanup(capturePageLeave);
  });

  createEffect(() => {
    if (!isSignedIn()) {
      navigate("/sign-in");
    }
  });

  return (
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between gap-8">
        <p>Delete account</p>
        <button onClick={deleteAccount} class="rounded-lg bg-red-500 px-4 py-2">
          Delete
        </button>
      </div>
    </div>
  );
};

export default AccountPage;
