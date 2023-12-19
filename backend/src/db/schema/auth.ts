import {
  pgTable,
  bigint,
  varchar,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { citext } from "../pg-types/citest.js";

// Taken from https://lucia-auth.com/guidebook/drizzle-orm/#postgresql
// Also useful: https://lucia-auth.com/database-adapters/pg/

// The length of a uuid, for example `230450c9-d72d-4ffc-a264-90cdb163e788`
const userIdLength = 36;

// Reminder: update lucia.d.ts with more types when this changes
export const userTable = pgTable("user", {
  id: varchar("id", {
    length: userIdLength,
  }).primaryKey(),
  // Defaults to null, but the user can set it
  name: varchar("name", {
    length: 255,
  }),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
  email: citext("email", {
    // lucia-auth will store the email in id of the key table in the format `email:name@example.com` when
    // email provider is used. This is called provider id in the code. However, lucia won't store the email from
    // outh providers.
    // email address must not exceed 254 characters. See https://stackoverflow.com/a/574698/7365866
    length: 254,
  }).unique(),
  pin: varchar("pin", { length: 6 }),
  isPinRequired: boolean("is_pin_required").default(false),
  username: citext("username", { length: 254 }).unique(),
});

export const userSession = pgTable("user_session", {
  id: varchar("id", {
    // TODO should this be as long as the email + provider name? 128 might be too short.
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: userIdLength,
  })
    .notNull()
    .references(() => userTable.id),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
  }).notNull(),
  createdAt: timestamp("created_at"),
});

export const userKey = pgTable("user_key", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: userIdLength,
  })
    .notNull()
    .references(() => userTable.id),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
});
