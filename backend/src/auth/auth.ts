import { pg } from "@lucia-auth/adapter-postgresql";
import { lucia } from "lucia";
import { env } from "../env.js";
import { Pool } from "pg";
import { fastify } from "lucia/middleware";

export const createAuth = (dbPool: Pool) =>
  lucia({
    env: env.ENVIRONMENT === "development" ? "DEV" : "PROD",
    adapter: pg(dbPool, {
      // table names defined in db/schema
      user: "user",
      key: "user_key",
      session: "user_session",
    }),
    middleware: fastify(),
    sessionCookie: { expires: false },
    getUserAttributes: (data) => {
      return {
        name: data.name,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    },
    getSessionAttributes: (data) => {
      return {
        createdAt: data.created_at,
      };
    },
  });

export type Auth = ReturnType<typeof createAuth>;
