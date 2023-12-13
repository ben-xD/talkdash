import { createEffect } from "solid-js";
import { isSignedIn, setBearerToken, trpc } from "../client/trpc.ts";
import { useNavigate } from "@solidjs/router";

const AccountPage = () => {
  const navigate = useNavigate();

  createEffect(() => {
    if (!isSignedIn()) {
      navigate("/sign-in");
    }
  });

  const deleteAccount = async () => {
    await trpc.auth.deleteUser.mutate({});
    setBearerToken(undefined);
  };

  return (
    <div class="flex items-center gap-8">
      <p>Delete account</p>
      <button onClick={deleteAccount} class="rounded-lg bg-red-500 px-4 py-2">
        Delete
      </button>
    </div>
  );
};

export default AccountPage;
