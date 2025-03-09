import { A } from "@solidjs/router";
import { createStore } from "solid-js/store";
import { Alert } from "../../components/Alert.tsx";
import { trpc } from "../../client/trpc.ts";
import { LOCAL_STORAGE_OAUTH_STATE } from "./constants.ts";
import { OAuthProviders } from "@talkdash/schema";
import { Card } from "../../components/Card.tsx";

export const AuthCard = (props: {
  title: string;
  subtitle: string;
  errorMessage?: string;
  mode: "sign-in" | "sign-up";
  onSubmit: (username: string, password: string) => void;
}) => {
  const label = () => (props.mode === "sign-in" ? "Sign In" : "Sign Up");
  const switchLabel = () => (props.mode === "sign-in" ? "Sign Up" : "Sign In");
  const switchPath = () => (props.mode === "sign-in" ? "/sign-up" : "/sign-in");
  const switchQuestion = () =>
    props.mode === "sign-in" ? "Don't have an account?" : "Have an account?";

  const [fields, setFields] = createStore<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const onSubmit = () => {
    props.onSubmit(fields.email, fields.password);
  };

  const signInWithOAuth = async (provider: OAuthProviders) => {
    const { redirectTo, state } = await trpc.auth.signInWithOAuth.mutate({
      provider,
    });
    window.localStorage.setItem(LOCAL_STORAGE_OAUTH_STATE, state);
    window.location.replace(redirectTo);
  };

  const onGitHubSignIn = async () => signInWithOAuth("github");

  // const onGoogleSignIn = () => signInWithOAuth("google");

  return (
    <div class="my-4 flex w-full max-w-[400px] flex-col items-center gap-6">
      <Card class="flex w-full flex-col items-stretch p-4">
        <div class="flex flex-1 flex-col gap-8">
          <div>
            <h1 class="lg:text-2xl">{props.title}</h1>
            <h2 class="text-sm">{props.subtitle}</h2>
            <Alert class="mt-4" message={props.errorMessage} />
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-4 text-center">
              <button class="btn-secondary" onClick={onGitHubSignIn}>
                Continue with GitHub
              </button>
              {/*<button class="btn-secondary" onClick={onGoogleSignIn}>*/}
              {/*  Continue with Google*/}
              {/*</button>*/}
            </div>
            <div class="flex justify-center text-sm">
              <span class="px-2 text-sm">or</span>
            </div>
            <div>
              <div class="flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                  <label for="email">Email</label>
                  <input
                    id="email"
                    class="input"
                    type="text"
                    onInput={(e) => setFields("email", e.target.value)}
                  />
                </div>
                <div class="flex flex-col gap-2">
                  <label for="password">Password</label>
                  <input
                    id="password"
                    class="input"
                    type="password"
                    onInput={(e) => setFields("password", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onSubmit();
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <button class="btn" onClick={onSubmit}>
            {label()}
          </button>
          <p class="text-center text-sm">
            {switchQuestion()}{" "}
            <A class="hover:text-primary-200 underline" href={switchPath()}>
              {switchLabel()}
            </A>
          </p>
        </div>
      </Card>
    </div>
  );
};
