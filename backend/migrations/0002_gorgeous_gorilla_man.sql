CREATE TABLE IF NOT EXISTS "speaker" (
	"username" varchar NOT NULL,
	"user_id" varchar,
	"pin" varchar,
	CONSTRAINT "speaker_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "speaker_pin" varchar(6);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "speaker" ADD CONSTRAINT "speaker_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
