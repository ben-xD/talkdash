import { z } from "zod";
import { Auth } from "./auth.js";
import { ConnectionContext } from "../trpc/trpcContext.js";

export const emailSchema = z.string().email().min(5);
export const passwordSchema = z
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
export const authModeSchema = z
  .union([z.literal("token"), z.literal("session")])
  .default("session");
// const authModeSchema = z.enum(["token", "session"]).default("session");

// This started as the tRPC + fastify implementation of https://lucia-auth.com/guidebook/sign-in-with-username-and-password/
// Also useful: https://lucia-auth.com/basics/users/
export type AuthMode = z.infer<typeof authModeSchema>;

export const createSessionAndSetClientAuthentication = async (
  auth: Auth,
  userId: string,
  username: string,
  connectionContext: ConnectionContext,
) => {
  const session = await auth.createSession({
    userId,
    attributes: {
      created_at: new Date(),
    },
  });
  connectionContext.session = session;
  return { bearerToken: session.sessionId, username };
};

// The code below shows how to use cookies for sessions, instead of bearer token.
// However, to support non-browser based clients and websockets, we use bearer tokens instead.
// const setSessionAndRedirectCookie = (
//   auth: Auth,
//   req: FastifyRequest,
//   res: FastifyReply,
//   session: Session,
// ) => {
//   const referer = req.headers["referer"];
//   const sessionCookie = auth.createSessionCookie(session);
//   if (referer && new URL(referer).pathname === "/trpc") {
//     res.header("Set-Cookie", sessionCookie.serialize()); // store session cookie on client
//     // Don't redirect because the client app is trpc-panel (generated UI testing similar to Swagger UI)
//     return;
//   }
//   res.header("Location", "/");
//   res.status(302);
// };
