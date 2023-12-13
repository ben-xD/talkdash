import { AuthCard } from "../features/auth/AuthCard.tsx";
import { isSignedIn, setBearerToken, trpc } from "../client/trpc";
import { TRPCClientError } from "@trpc/client";
import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = createSignal<string>();

  const onSignUp = async (email: string, password: string) => {
    onMount(() => {
      if (isSignedIn()) {
        navigate("/");
      }
    });

    // TODO compare with tanstack query (see SignInPage)
    // TODO replace with tanstack query

    try {
      const reply = await trpc.auth.signUpWithEmail.mutate({
        email,
        password,
        name: "",
        authMode: "session",
      });
      setBearerToken(reply.bearerToken);
      setErrorMessage(undefined);
      navigate("/");
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
