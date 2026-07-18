ALTER TABLE "rsvps" DROP CONSTRAINT "rsvps_attendance_guest_count_check";--> statement-breakpoint
ALTER TABLE "rsvps" ADD COLUMN "friday_attendance" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "rsvps" ADD COLUMN "saturday_attendance" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "rsvps" ADD COLUMN "sunday_attendance" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "rsvps" ADD COLUMN "menu_choice" varchar(64);--> statement-breakpoint
ALTER TABLE "rsvps" ADD CONSTRAINT "rsvps_attendance_guest_count_check" CHECK (("rsvps"."attendance" = 'attending' and "rsvps"."guest_count" between 1 and 10 and ("rsvps"."friday_attendance" or "rsvps"."saturday_attendance" or "rsvps"."sunday_attendance")) or ("rsvps"."attendance" = 'declined' and "rsvps"."guest_count" = 0 and not "rsvps"."friday_attendance" and not "rsvps"."saturday_attendance" and not "rsvps"."sunday_attendance"));