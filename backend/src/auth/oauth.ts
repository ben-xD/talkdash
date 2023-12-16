import { uuid } from "../uuid.js";
import { Auth } from "./auth.js";
import { GithubUserAuth, GoogleUserAuth } from "@lucia-auth/oauth/providers";

// Consider supporting multiple OAuth providers linked to the same user
// See https://lucia-auth.com/oauth/basics/handle-users/#add-a-new-key-to-an-existing-user

export const getOrCreateUserFromGoogleUser = async (
  auth: GoogleUserAuth<Auth>,
) => {
  const existingUser = await auth.getExistingUser();
  if (existingUser) return existingUser;

  const { email, name } = auth.googleUser;
  return await auth.createUser({
    userId: uuid(),
    attributes: {
      email: email ?? null,
      created_at: new Date(),
      updated_at: new Date(),
      name: name,
      username: null,
    },
  });
};

export const getOrCreateUserFromGithubUser = async (
  auth: GithubUserAuth<Auth>,
) => {
  const existingUser = await auth.getExistingUser();
  if (existingUser) return existingUser;

  const { email, name } = auth.githubUser;
  return await auth.createUser({
    userId: uuid(),
    attributes: {
      email: email ?? null,
      created_at: new Date(),
      updated_at: new Date(),
      name: name ?? null,
      username: null,
    },
  });
};
