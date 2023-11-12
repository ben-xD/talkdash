import { AuthCard } from "../components/AuthCard";
import { trpc } from "../client/trpc";

export const SignInPage = () => {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your account"
      mode="sign-in"
      onSubmit={(email, password) =>
        trpc.auth.signIn.mutate({ email, password, authMode: "session" })
      }
    />
  );
};
