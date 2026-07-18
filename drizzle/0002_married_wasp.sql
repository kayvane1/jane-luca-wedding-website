CREATE UNIQUE INDEX IF NOT EXISTS "rsvps_primary_guest_name_unique" ON "rsvps" USING btree (lower("primary_guest_name"));--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "rsvps_email_unique" ON "rsvps" USING btree (lower("email")) WHERE "rsvps"."email" is not null;
