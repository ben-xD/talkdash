import { pg } from "@lucia-auth/adapter-postgresql";
import { Configuration, lucia } from "lucia";
import {
  env,
  githubOAuthConfigSchema,
  googleOAuthConfigSchema,
} from "../env.js";
import { Pool } from "pg";
import { fastify } from "lucia/middleware";
import {
  github,
  GithubUserAuth,
  google,
  GoogleAuth,
  GoogleUserAuth,
} from "@lucia-auth/oauth/providers";
import { OAuthProviders } from "@talkdash/schema";
import { TRPCError } from "@trpc/server";

export type UserAttributes = {
  name?: string;
  username?: string;
  createdAt: Date;
  updatedAt: Date;
};

export const createAuth = (dbPool: Pool) =>
  lucia<Configuration<UserAttributes>>({
    csrfProtection: {
      // Is this necessary?
      // host: "localhost:4000",
      // host: "talkdash.orth.uk",
    },
    env: env.ENVIRONMENT === "development" ? "DEV" : "PROD",
    adapter: pg(dbPool, {
      // table names defined in db/schema
      user: "user",
      key: "user_key",
      session: "user_session",
    }),
    middleware: fastify(),
    // Not the session, but the session cookie. See https://lucia-auth.com/basics/using-cookies/
    sessionCookie: { expires: false },
    getUserAttributes: (data) => {
      return {
        name: data.name ?? undefined,
        createdAt: data.created_at as Date,
        updatedAt: data.updated_at as Date,
        username: data.username ?? undefined,
      } satisfies UserAttributes;
    },
    getSessionAttributes: (data) => {
      return {
        createdAt: data.created_at,
      };
    },
  });

export type Auth = ReturnType<typeof createAuth>;

export const createOAuths = (auth: Auth) => {
  let googleAuth: GoogleAuth<Auth> | undefined = undefined;
  if (env.AUTH_GOOGLE) {
    const googleConfig = googleOAuthConfigSchema.parse(process.env);
    googleAuth = google(auth, {
      clientId: googleConfig.GOOGLE_ID,
      clientSecret: googleConfig.GOOGLE_SECRET,
      redirectUri: googleConfig.GOOGLE_REDIRECT_URI,
      // scope: ,
    });
  }

  const githubConfig = githubOAuthConfigSchema.parse(process.env);
  return {
    google: googleAuth,
    github: github(auth, {
      clientId: githubConfig.GITHUB_ID,
      clientSecret: githubConfig.GITHUB_SECRET,
      // scope: ,
      // redirectUri: ,
    }),
  };
};
export type OAuths = ReturnType<typeof createOAuths>;
export type GithubUser = GithubUserAuth<Auth>;
export type GoogleUser = GoogleUserAuth<Auth>;

export const assertProviderExists = <T>(
  provider: T,
  name: OAuthProviders,
): NonNullable<T> => {
  if (!provider) {
    throw new TRPCError({
      code: "METHOD_NOT_SUPPORTED",
      message: `OAuth provider ${name} not available`,
    });
  }
  return provider;
};
