import { useNavigate, useParams, useSearchParams } from "@solidjs/router";
import { onMount } from "solid-js";
import { setBearerToken, trpc } from "../client/trpc.ts";
import { oAuthProviders } from "@talkdash/schema";
import { LOCAL_STORAGE_OAUTH_STATE } from "../features/auth/constants.ts";
import { setRegisteredUsername } from "../features/user/userState.tsx";
import { toast } from "solid-toast";
import { TRPCClientError } from "@trpc/client";

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const params = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams<{
    code: string;
    state: string;
  }>();

  // http://localhost:5173/auth/callback/github?code=a9a3039c911cdf73adaa&state=ql3zqdfbgaogmn5vd30cgphxzlvjlrn76ny9abrk4ym

  onMount(async () => {
    const provider = oAuthProviders.safeParse(params.provider);
    const state = searchParams.state;

    const persistedState = window.localStorage.getItem(
      LOCAL_STORAGE_OAUTH_STATE,
    );
    if (persistedState && state !== persistedState) {
      // If a state is used, make sure to check if the state in the query params is the same as the one stored as a cookie.
      // See https://lucia-auth.com/oauth/basics/oauth2-pkce/
      // TODO show error to user
      window.localStorage.removeItem(LOCAL_STORAGE_OAUTH_STATE);
      console.error("State mismatch");
    }

    const code = searchParams.code;
    if (provider.success) {
      if (params.provider === "github" || params.provider === "google") {
        try {
          const { bearerToken, username } =
            await trpc.auth.validateCallback.mutate({
              provider: params.provider,
              code,
            });
          setBearerToken(bearerToken);
          setRegisteredUsername(username);
        } catch (e) {
          if (e instanceof TRPCClientError) {
            // TODO show error in a persistent ui, not just in toast. By passing error as query param?
            const { message } = e;
            toast(() => (
              <p class="text-secondary-800">Failed to login: {message}</p>
            ));
          } else {
            toast(() => <p class="text-secondary-800">Failed to login</p>);
          }
        }
      } else {
        console.error("Unknown provider", params.provider);
      }
    } else {
      // TODO show error to use
      console.error("Provider was not formatted correctly", provider.error);
    }

    // Always navigate?
    // TODO navigate to a specific page for different success / error cases
    // Get the original user request and redirect to that page
    navigate("/");
  });

  return (
    <div class="flex flex-col gap-4 py-4">
      <p>Logging in using {params.provider}...</p>
    </div>
  );
};

export default OAuthCallbackPage;
