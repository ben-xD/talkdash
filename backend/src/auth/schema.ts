import { z } from "zod";

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
