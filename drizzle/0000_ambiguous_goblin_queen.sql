CREATE TYPE "public"."rsvp_attendance" AS ENUM('attending', 'declined');--> statement-breakpoint
CREATE TABLE "rsvps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_code" varchar(64),
	"primary_guest_name" text NOT NULL,
	"email" varchar(320),
	"attendance" "rsvp_attendance" NOT NULL,
	"guest_count" integer NOT NULL,
	"guest_names" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"dietary_requirements" text,
	"message" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rsvps_attendance_guest_count_check" CHECK (("rsvps"."attendance" = 'attending' and "rsvps"."guest_count" between 1 and 10) or ("rsvps"."attendance" = 'declined' and "rsvps"."guest_count" = 0))
);
--> statement-breakpoint
CREATE INDEX "rsvps_invitation_code_idx" ON "rsvps" USING btree ("invitation_code");--> statement-breakpoint
CREATE INDEX "rsvps_submitted_at_idx" ON "rsvps" USING btree ("submitted_at");