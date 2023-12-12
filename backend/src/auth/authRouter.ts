import { router } from "../trpc/trpc.js";
import {
  loggedProcedure,
  protectedProcedure,
} from "../trpc/middlewares/middleware.js";
import { z } from "zod";
import { uuid } from "../uuid.js";
import { LuciaError } from "lucia";
import { TRPCError } from "@trpc/server";
import { assertProviderExists } from "./auth.js";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { oAuthProviders } from "@talkdash/schema";
import {
  getOrCreateUserFromGithubUser,
  getOrCreateUserFromGoogleUser,
} from "./oauth.js";
import {
  authModeSchema,
  createSessionAndSetClientAuthentication,
  emailSchema,
  passwordSchema,
} from "./schema.js";
import { assertAnonymous, assertAuth } from "../trpc/assert.js";
import { userTable } from "../db/schema/index.js";
import { eq } from "drizzle-orm";

export const authRouter = router({
  signUpWithEmail: loggedProcedure
    .input(
      z.object({
        name: z.string(),
        email: emailSchema,
        username: z.string().optional(),
        password: passwordSchema,
        authMode: authModeSchema,
      }),
    )
    .output(z.object({ bearerToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = uuid();
      try {
        const user = await ctx.auth.createUser({
          userId,
          key: {
            providerId: "email",
            providerUserId: input.email.toLowerCase(),
            password: input.password,
          },
          attributes: {
            name: input.name,
            created_at: new Date(),
            updated_at: new Date(),
            email: null,
            username: input.username ?? null,
          },
        });

        return createSessionAndSetClientAuthentication(
          ctx.auth,
          userId,
          user.username,
          ctx.connectionContext,
        );
      } catch (e) {
        if (e instanceof LuciaError && e.message === `AUTH_DUPLICATE_KEY_ID`) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already in use",
          });
        }
        // for example, provided user attributes violates database rules (e.g. unique constraint)
        // or unexpected database errors (Drizzle/postgres error)
        console.error("Error signing up with email", e);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  signInWithEmail: loggedProcedure
    .input(
      z.object({
        email: emailSchema,
        password: passwordSchema,
        authMode: authModeSchema,
      }),
    )
    .output(z.object({ bearerToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const key = await ctx.auth.useKey(
          "email",
          input.email.toLowerCase(),
          input.password,
        );
        const user = await ctx.auth.getUser(key.userId);
        return createSessionAndSetClientAuthentication(
          ctx.auth,
          key.userId,
          user.username,
          ctx.connectionContext,
        );
      } catch (e) {
        if (e instanceof LuciaError) {
          console.error(e);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid login.",
          });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  deleteUser: protectedProcedure
    .input(z.object({ email: emailSchema, password: passwordSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Requires password even if signed in
        const key = await ctx.auth.useKey(
          "email",
          input.email.toLowerCase(),
          input.password,
        );
        ctx.auth.deleteUser(key.userId);
        await ctx.auth.invalidateAllUserSessions(key.userId);
        return;
      } catch (e) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }
    }),
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.connectionContext.session) {
      await ctx.auth.invalidateSession(ctx.connectionContext.session.sessionId);
    } else if (ctx.session) {
      await ctx.auth.invalidateSession(ctx.session.sessionId);
    } else {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are already signed out.",
      });
    }
    // TODO only set cookie headers when it's HTTP, not websocket
    // create blank session cookie
    // const sessionCookie = ctx.auth.createSessionCookie(null);
    // ctx.res.header("Location", "/sign-in");
    // ctx.res.header("Set-Cookie", sessionCookie.serialize());
    // ctx.res.status(302);
  }),
  // TODO implement password reset
  // resetPasswordSendEmail: loggedProcedure
  // resetPasswordChangePassword: loggedProcedure
  // updateUser: protectedProcedure
  //   // TODO check password again even if signed in
  //   .input(z.object({ email: emailSchema, password: passwordSchema, newName: z.string() }))
  //   .mutation(async ({ ctx, input }) => {}),
  authenticateWebsocketConnection: loggedProcedure
    .input(z.object({ bearerToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // We can't mutate `ctx.session` directly because it will be reset in the next procedure. Similarly, this won't work
      // ctx.test = { name: "procedure 1" };
      // This happens because of tRPC's implementation details: we'd edit a temporary context for that procedure
      // because tRPC merges 2 contexts together when moving between middlewares.
      // If you edit anything inside specific properties, these will exist because they are copied from the original context.
      ctx.connectionContext.session = await ctx.auth.validateSession(
        input.bearerToken,
      );
      return;
    }),
  signInWithOAuth: loggedProcedure
    .input(z.object({ provider: oAuthProviders }))
    .output(
      z.object({
        redirectTo: z.string().url(),
        state: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.provider === "github") {
        const [url, state] = await ctx.oAuths.github.getAuthorizationUrl();
        return {
          redirectTo: url.toString(),
          state,
        };
      } else if (input.provider === "google") {
        const [url, state] = await assertProviderExists(
          ctx.oAuths.google,
          "google",
        ).getAuthorizationUrl();
        return {
          redirectTo: url.toString(),
          state,
        };
      }
      input.provider satisfies never;
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }),
  validateCallback: loggedProcedure
    .input(z.object({ provider: oAuthProviders, code: z.string() }))
    .output(
      z.object({ bearerToken: z.string(), username: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.provider === "github") {
          const githubUser = await ctx.oAuths.github.validateCallback(
            input.code,
          );
          const user = await getOrCreateUserFromGithubUser(githubUser);
          return createSessionAndSetClientAuthentication(
            ctx.auth,
            user.userId,
            user.username,
            ctx.connectionContext,
          );
        } else if (input.provider === "google") {
          const googleUser = await assertProviderExists(
            ctx.oAuths.google,
            "google",
          ).validateCallback(input.code);
          const user = await getOrCreateUserFromGoogleUser(googleUser);
          return createSessionAndSetClientAuthentication(
            ctx.auth,
            user.userId,
            user.username,
            ctx.connectionContext,
          );
        } else {
          input.provider satisfies never;
          throw new TRPCError({
            code: "METHOD_NOT_SUPPORTED",
            message: "OAuth provider not supported",
          });
        }
      } catch (e) {
        console.error({ e });
        if (e instanceof OAuthRequestError) {
          // const { request, response } = e;
          // TODO understand all error cases and show useful error to user
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  // Multiple users can share the same temporary username
  setTemporaryUsername: loggedProcedure
    .input(z.object({ newUsername: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.connectionContext.session?.user?.userId;
      assertAnonymous("userId", !userId);

      const oldUsername = ctx.connectionContext.temporaryUsername;
      const { newUsername } = input;
      if (newUsername) {
        const [existingUser] = await ctx.db
          .select()
          .from(userTable)
          .where(eq(userTable.username, newUsername));
        if (existingUser)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username already exists.",
          });
      }

      ctx.connectionContext.temporaryUsername = newUsername;
      console.info(
        `Temporary username change: ${oldUsername} is now known as ${newUsername}`,
      );
    }),
  getUsername: protectedProcedure
    .input(z.object({}))
    .output(z.string().optional())
    .query(async ({ ctx }) => {
      const userId = ctx.connectionContext.session?.user?.userId;
      assertAuth("userId", userId);
      const [user] = await ctx.db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId));
      return user?.username ?? undefined;
    }),
  registerUsername: protectedProcedure
    .input(z.object({ newUsername: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.connectionContext.session?.user?.userId;
      assertAuth("userId", userId);
      ctx.connectionContext.temporaryUsername = undefined;

      if (input.newUsername) {
        // Error if conflicting with other user's username
        const [added] = await ctx.db
          .update(userTable)
          .set({ username: input.newUsername })
          .where(eq(userTable.id, userId))
          .returning();
        if (!added) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Username already exists.",
          });
        }
      }
    }),
});
