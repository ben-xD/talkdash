import { AuthCard } from "../features/auth/AuthCard.tsx";
import { isSignedIn, setBearerToken, trpc } from "../client/trpc";
import { TRPCClientError } from "@trpc/client";
import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { navigateAfterAuth } from "../features/auth/navigateAfterAuth.ts";
import { setRegisteredUsername } from "../features/user/userState.tsx";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = createSignal<string>();

  onMount(() => {
    document.title = "Sign up · TalkDash";
  });

  const onSignUp = async (email: string, password: string) => {
    onMount(() => {
      if (isSignedIn()) {
        navigate("/");
      }
    });

    try {
      const reply = await trpc.auth.signUpWithEmail.mutate({
        email,
        password,
        name: "",
        authMode: "session",
      });
      setBearerToken(reply.bearerToken);
      setRegisteredUsername(reply.username);
      setErrorMessage(undefined);
      navigateAfterAuth(navigate);
    } catch (e) {
      if (e instanceof TRPCClientError) {
        setErrorMessage(e.message);
      }
    }
  };

  return (
    <AuthCard
      title="Get started"
      errorMessage={errorMessage()}
      subtitle="Create a new account"
      mode="sign-up"
      onSubmit={onSignUp}
    />
  );
};

export default SignUpPage;
