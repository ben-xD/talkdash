import { createEffect, onMount } from "solid-js";
import { deleteAccount, isSignedIn } from "../client/trpc.ts";
import { useNavigate } from "@solidjs/router";

const AccountPage = () => {
  const navigate = useNavigate();

  onMount(() => {
    document.title = "Account · TalkDash";
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
