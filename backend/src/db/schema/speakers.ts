import { pgTable, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth.js";

export const speakerTable = pgTable("speaker", {
  username: varchar("username").unique().notNull(),
  userId: varchar("user_id").references(() => user.id),
  pin: varchar("pin"),
});
