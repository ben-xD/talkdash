import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const messageTable = pgTable("messages", {
  id: uuid("id").primaryKey(),
  fromUserId: uuid("from_user_id"),
  toUserId: uuid("to_user_id").notNull(),
  body: text("body").notNull(),
  createdAtSeconds: timestamp("created_at_seconds", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertMessageSchema = createInsertSchema(messageTable);
export type InsertMessageSchema = z.infer<typeof insertMessageSchema>;
export const selectMessageSchema = createSelectSchema(messageTable);
export type SelectMessageSchema = z.infer<typeof selectMessageSchema>;
