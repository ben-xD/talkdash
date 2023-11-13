import { uuid } from "../uuid.js";
import { GithubUser, GoogleUser } from "./auth.js";

// Consider supporting multiple OAuth providers linked to the same user
// See https://lucia-auth.com/oauth/basics/handle-users/#add-a-new-key-to-an-existing-user

export const getOrCreateUserFromGoogleUser = async (googleUser: GoogleUser) => {
  const existingUser = await googleUser.getExistingUser();
  if (existingUser) return existingUser;
  return await googleUser.createUser({
    userId: uuid(),
    attributes: {
      email: googleUser.googleUser.email ?? null,
      created_at: new Date(),
      updated_at: new Date(),
      name: null,
    },
  });
};

export const getOrCreateUserFromGithubUser = async (githubUser: GithubUser) => {
  const existingUser = await githubUser.getExistingUser();
  if (existingUser) return existingUser;
  return await githubUser.createUser({
    userId: uuid(),
    attributes: {
      email: githubUser.githubUser.email ?? null,
      created_at: new Date(),
      updated_at: new Date(),
      name: null,
    },
  });
};
