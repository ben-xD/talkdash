import { router } from "../trpc/trpc.js";
import {
  loggedProcedure,
  protectedProcedure,
} from "../trpc/middlewares/middleware.js";
import { z } from "zod";
import { uuid } from "../uuid.js";
import { LuciaError, Session } from "lucia";
import { TRPCError } from "@trpc/server";
import { Auth } from "./auth.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { assertUnreachable } from "../typescriptTricks.js";

const setSessionCookie = (
  auth: Auth,
  req: FastifyRequest,
  res: FastifyReply,
  session: Session,
) => {
  const referer = req.headers["referer"];
  if (referer && new URL(referer).pathname === "/trpc") {
    // Don't do anything because the client app is trpc-panel (generated UI testing similar to Swagger UI)
    return;
  }
  const sessionCookie = auth.createSessionCookie(session);
  res.header("Location", "/"); // redirect to profile page
  res.header("Set-Cookie", sessionCookie.serialize()); // store session cookie on client
  res.status(302);
};

const createSessionAndSetClientAuthentication = async (
  auth: Auth,
  req: FastifyRequest,
  res: FastifyReply,
  userId: string,
  authMode: AuthMode,
) => {
  const session = await auth.createSession({
    userId,
    attributes: {
      created_at: new Date(),
    },
  });

  switch (authMode) {
    case "token":
      // pilcrow: session ids are bearer tokens 😄
      return { bearerToken: session.sessionId };
    case "session":
      setSessionCookie(auth, req, res, session);
      return {};
    default:
      return assertUnreachable(authMode);
  }
};

const emailSchema = z.string().email().min(5);
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(128, { message: "Password must be no more than 128 characters long" })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one digit" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  });
const authModeSchema = z
  .union([z.literal("token"), z.literal("session")])
  .default("session");
// const authModeSchema = z.enum(["token", "session"]).default("session");

// This started as the tRPC + fastify implementation of https://lucia-auth.com/guidebook/sign-in-with-username-and-password/
// Also useful: https://lucia-auth.com/basics/users/
export type AuthMode = z.infer<typeof authModeSchema>;

export const authRouter = router({
  signUpWithEmail: loggedProcedure
    .input(
      z.object({
        name: z.string(),
        email: emailSchema,
        password: passwordSchema,
        authMode: authModeSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = uuid();
      try {
        await ctx.auth.createUser({
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
          },
        });

        return createSessionAndSetClientAuthentication(
          ctx.auth,
          ctx.req,
          ctx.res,
          userId,
          input.authMode,
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
  logIn: loggedProcedure
    .input(
      z.object({
        email: emailSchema,
        password: passwordSchema,
        authMode: authModeSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const key = await ctx.auth.useKey(
          "email",
          input.email.toLowerCase(),
          input.password,
        );
        return createSessionAndSetClientAuthentication(
          ctx.auth,
          ctx.req,
          ctx.res,
          key.userId,
          input.authMode,
        );
      } catch (e) {
        if (e instanceof LuciaError) {
          console.error(e);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid combination of email and password",
          });
        }
        return new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
  deleteUser: protectedProcedure
    .input(z.object({ email: emailSchema, password: passwordSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Requires password even if logged in
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
  logOut: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.auth.invalidateSession(ctx.session.sessionId);
    // create blank session cookie
    const sessionCookie = ctx.auth.createSessionCookie(null);
    ctx.res.header("Location", "/login");
    ctx.res.header("Set-Cookie", sessionCookie.serialize());
    ctx.res.status(302);
  }),
  // TODO implement password reset
  // resetPasswordSendEmail: loggedProcedure
  // resetPasswordChangePassword: loggedProcedure
  // updateUser: protectedProcedure
  //   // TODO check password again even if logged in
  //   .input(z.object({ email: emailSchema, password: passwordSchema, newName: z.string() }))
  //   .mutation(async ({ ctx, input }) => {}),
});
