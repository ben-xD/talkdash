DROP TABLE "speaker";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "speaker_pin" TO "pin";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "username" varchar(254);--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");