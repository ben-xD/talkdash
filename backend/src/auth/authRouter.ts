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
import { authModeSchema, emailSchema, passwordSchema } from "./schema.js";
import {
  assertAnonymous,
  assertAuth,
  assertWebsocketClient,
} from "../trpc/assert.js";
import { userTable } from "../db/schema/index.js";
import { eq } from "drizzle-orm";
import { TrpcContext } from "../trpc/trpcContext.js";
import { createSessionAndSetClientAuth } from "./createSessionAndSetClientAuth.js";
import { throwUnauthenticatedError, internalServerError } from "./errors.js";

const setTemporaryUsername = (
  ctx: TrpcContext,
  newUsername: string | undefined,
) => {
  if (ctx.clientProtocol === "ws") {
    ctx.connectionContext.temporaryUsername = newUsername;
  } else if (ctx.clientProtocol === "http") {
    ctx.res.header("Set-Cookie", "temporaryUsername=" + newUsername);
  }
};

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

        return createSessionAndSetClientAuth(ctx, userId, user.username);
      } catch (e) {
        if (e instanceof LuciaError && e.message === `AUTH_DUPLICATE_KEY_ID`) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already in use.",
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
        return createSessionAndSetClientAuth(ctx, key.userId, user.username);
      } catch (e) {
        if (e instanceof LuciaError) {
          console.error(e);
          throwUnauthenticatedError("Invalid email or password");
        }
        throw internalServerError;
      }
    }),
  deleteUser: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx }) => {
      assertWebsocketClient(ctx.clientProtocol);
      const userId = ctx.connectionContext?.session?.user?.userId;
      assertAuth("userId", userId);

      try {
        ctx.auth.deleteUser(userId);
        await ctx.auth.invalidateAllUserSessions(userId);
        await ctx.auth.deleteDeadUserSessions(userId);
        return;
      } catch (e) {
        throwUnauthenticatedError("Invalid email or password");
      }
    }),
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    assertWebsocketClient(ctx.clientProtocol);
    if (ctx?.connectionContext?.session) {
      await ctx.auth.invalidateSession(ctx.connectionContext.session.sessionId);
      const userId = ctx.connectionContext.session.user.userId;
      await ctx.auth.deleteDeadUserSessions(userId);
    } else {
      throwUnauthenticatedError("You are already signed out.");
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
      assertWebsocketClient(ctx.clientProtocol);
      // We can't mutate `ctx.session` directly because it will be reset in the next procedure. Similarly, this won't work
      // ctx.test = { name: "procedure 1" };
      // This happens because of tRPC's implementation details: we'd edit a temporary context for that procedure
      // because tRPC merges 2 contexts together when moving between middlewares.
      // If you edit anything inside specific properties, these will exist because they are copied from the original context.
      try {
        ctx.connectionContext.session = await ctx.auth.validateSession(
          input.bearerToken,
        );
      } catch (e) {
        if (e instanceof LuciaError) {
          console.error(e);
          throwUnauthenticatedError("Invalid/expired bearer token.");
        }
      }
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
      throw internalServerError;
    }),
  validateCallback: loggedProcedure
    .input(z.object({ provider: oAuthProviders, code: z.string() }))
    .output(
      z.object({ bearerToken: z.string(), username: z.string().optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.provider === "github") {
          const githubUserAuth = await ctx.oAuths.github.validateCallback(
            input.code,
          );
          const user = await getOrCreateUserFromGithubUser(githubUserAuth);
          return createSessionAndSetClientAuth(ctx, user.userId, user.username);
        } else if (input.provider === "google") {
          const googleUser = await assertProviderExists(
            ctx.oAuths.google,
            "google",
          ).validateCallback(input.code);
          const user = await getOrCreateUserFromGoogleUser(googleUser);
          return createSessionAndSetClientAuth(ctx, user.userId, user.username);
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
          throwUnauthenticatedError(
            "Failed to process OAuth validate callback",
          );
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  // Multiple users can share the same temporary username
  setTemporaryUsername: loggedProcedure
    .input(z.object({ newUsername: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      assertWebsocketClient(ctx.clientProtocol);
      const userId = ctx.connectionContext?.session?.user?.userId;
      assertAnonymous("userId", !userId);

      const oldUsername = ctx.connectionContext?.temporaryUsername;
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

      setTemporaryUsername(ctx, newUsername);
      console.info(
        `Temporary username change: ${oldUsername} is now known as ${newUsername}`,
      );
    }),
  getRegisteredUsername: protectedProcedure
    .input(z.object({}))
    .output(z.string().optional())
    .query(async ({ ctx }) => {
      assertWebsocketClient(ctx.clientProtocol);
      const userId = ctx.connectionContext?.session?.user?.userId;
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
      assertWebsocketClient(ctx.clientProtocol);
      const userId = ctx.connectionContext?.session?.user?.userId;
      assertAuth("userId", userId);
      setTemporaryUsername(ctx, undefined);

      if (input.newUsername) {
        // Error if conflicting with other user's username
        try {
          await ctx.db
            .update(userTable)
            .set({ username: input.newUsername })
            .where(eq(userTable.id, userId))
            .returning();
        } catch (e) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Username '${input.newUsername}' is already in use.`,
          });
        }
      }
    }),
});
