import { AuthCard } from "../components/AuthCard";
import { trpc } from "../client/trpc";

export const SignUpPage = () => {
  return (
    <AuthCard
      title="Get started"
      subtitle="Create a new account"
      mode="sign-up"
      onSubmit={(email, password) =>
        trpc.auth.signUpWithEmail.mutate({
          email,
          password,
          name: "",
          authMode: "session",
        })
      }
    />
  );
};
