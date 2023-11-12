import { AuthCard } from "../components/AuthCard.tsx";
import { trpc } from "../client/trpc.ts";

export const SignInPage = () => {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your account"
      mode="sign-in"
      onSubmit={async (email, password) => {
        await trpc.auth.signIn.mutate({ email, password, authMode: "session" });
      }}
    />
  );
};
