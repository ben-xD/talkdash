import { AuthCard } from "../components/AuthCard";
import { isSignedIn, setBearerToken, trpc } from "../client/trpc";
import { createMutation } from "@tanstack/solid-query";
import { onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

export const SignInPage = () => {
  const navigate = useNavigate();

  onMount(() => {
    if (isSignedIn()) {
      navigate("/");
    }
  });

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    const reply = await trpc.auth.signInWithEmail.mutate({
      email,
      password,
      authMode: "session",
    });
    setBearerToken(reply.bearerToken);
    navigate("/");
  };

  const mutation = createMutation(() => ({
    mutationFn: signIn,
  }));

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your account"
      mode="sign-in"
      errorMessage={mutation?.error?.message ?? undefined}
      onSubmit={(email, password) => mutation.mutate({ email, password })}
    />
  );
};
