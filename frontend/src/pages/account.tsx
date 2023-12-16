import { createEffect } from "solid-js";
import { deleteAccount, isSignedIn } from "../client/trpc.ts";
import { useNavigate } from "@solidjs/router";

const AccountPage = () => {
  const navigate = useNavigate();

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
      <div class="flex justify-between">App build date: {__BUILD_DATE__}</div>
    </div>
  );
};

export default AccountPage;
