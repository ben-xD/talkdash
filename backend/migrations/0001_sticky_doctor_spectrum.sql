ALTER TABLE "user" ADD COLUMN "email" varchar(254);--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");