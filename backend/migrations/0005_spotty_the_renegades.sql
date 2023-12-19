CREATE EXTENSION IF NOT EXISTS citext;
ALTER TABLE "user" ALTER COLUMN "email" SET DATA TYPE citext;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "username" SET DATA TYPE citext;