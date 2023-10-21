CREATE TABLE IF NOT EXISTS "messsages" (
	"id" uuid PRIMARY KEY NOT NULL,
	"from_user_id" uuid,
	"to_user_id" uuid NOT NULL,
	"body" text NOT NULL,
	"created_at_seconds" timestamp with time zone DEFAULT now() NOT NULL
);
