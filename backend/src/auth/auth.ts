import { type AuthConfig } from "@auth/core";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { Database } from "../db/db.js";
import { env } from "../env.js";

export const createAuthJsConfig = (db: Database): AuthConfig => ({
  adapter: DrizzleAdapter(db),
  secret: env.AUTH_SECRET,
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
    }),
  ],
  // Why? To prevent error: `UntrustedHost: Host must be trusted. URL was: localhost:4000/api/auth/providers`
  // See more info on https://github.com/nextauthjs/next-auth/issues/7715
  trustHost: true,
  debug: true,
  // logger: {
  //   error(code, ...message) {
  //     console.error(code, message);
  //   },
  //   warn(code, ...message) {
  //     console.warn(code, message);
  //   },
  //   debug(code, ...message) {
  //     console.debug(code, message);
  //   },
  // },
});
