import { pgTable, bigint, varchar, timestamp } from "drizzle-orm/pg-core";

// Taken from https://lucia-auth.com/guidebook/drizzle-orm/#postgresql
// Also useful: https://lucia-auth.com/database-adapters/pg/

// The length of a uuid, for example `230450c9-d72d-4ffc-a264-90cdb163e788`
const userIdLength = 36;

// Reminder: update lucia.d.ts with more types when this changes
export const user = pgTable("user", {
  id: varchar("id", {
    length: userIdLength,
  }).primaryKey(),
  name: varchar("name", {
    length: 255,
  }),
  // lucia-auth will store the email in id of the key table in the format `email:name@example.com`.
  // This is called provider id in the code. Therefore, we don't need the email column here.
  // email: varchar("email", {
  //   // email address must not exceed 254 characters. See https://stackoverflow.com/a/574698/7365866
  //   length: 254,
  // }).unique(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const userSession = pgTable("user_session", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: userIdLength,
  })
    .notNull()
    .references(() => user.id),
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
    .references(() => user.id),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
});
