import { useParams, useSearchParams } from "@solidjs/router";
import { For, onMount } from "solid-js";
import { trpc } from "../client/trpc.ts";
import { oAuthProviders } from "talkdash-schema";
import { LOCAL_STORAGE_OAUTH_STATE } from "../features/auth/constants.ts";

export const OAuthCallbackPage = () => {
  const params = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams<{ code: string; state: string }>();

  // http://localhost:5173/auth/callback/github?code=a9a3039c911cdf73adaa&state=ql3zqdfbgaogmn5vd30cgphxzlvjlrn76ny9abrk4ym

  onMount(async () => {
    const provider = oAuthProviders.safeParse(params.provider);
    const state = searchParams.state;
    const persistedState = window.localStorage.getItem(
      LOCAL_STORAGE_OAUTH_STATE,
    );
    if (state !== persistedState) {
      // If a state is used, make sure to check if the state in the query params is the same as the one stored as a cookie.
      // See https://lucia-auth.com/oauth/basics/oauth2-pkce/
      // TODO show error to user
      throw new Error("State mismatch");
    }

    const code = searchParams.code;
    if (provider.success) {
      if (params.provider === "github" || params.provider === "google") {
        await trpc.auth.validateCallback.mutate({
          provider: params.provider,
          code,
        });
      } else {
        console.error("Unknown provider", params.provider);
      }
    } else {
      // TODO show error to use
      console.error("Provider was not formatted correctly", provider.error);
      return;
    }
  });

  return (
    <div class="flex flex-col gap-4">
      <p>OAuthCallback</p>
      <For each={Object.values(params)}>{(item) => <p>{item}</p>}</For>
      <For each={Object.values(searchParams)}>{(item) => <p>{item}</p>}</For>
    </div>
  );
};
