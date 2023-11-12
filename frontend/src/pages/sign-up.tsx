import { AuthCard } from "../components/AuthCard.tsx";
import { trpc } from "../client/trpc.ts";

export const SignUpPage = () => {
  return (
    <AuthCard
      title="Get started"
      subtitle="Create a new account"
      mode="sign-up"
      onSubmit={async (email, password) => {
        await trpc.auth.signUpWithEmail.mutate({
          email,
          password,
          name: "",
          authMode: "session",
        });
      }}
    />
  );
};
