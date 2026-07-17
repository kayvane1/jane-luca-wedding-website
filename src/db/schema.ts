import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const rsvpAttendance = pgEnum("rsvp_attendance", [
  "attending",
  "declined",
]);

export const rsvps = pgTable(
  "rsvps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    invitationCode: varchar("invitation_code", { length: 64 }),
    primaryGuestName: text("primary_guest_name").notNull(),
    email: varchar("email", { length: 320 }),
    attendance: rsvpAttendance("attendance").notNull(),
    fridayAttendance: boolean("friday_attendance").notNull().default(false),
    saturdayAttendance: boolean("saturday_attendance").notNull().default(false),
    sundayAttendance: boolean("sunday_attendance").notNull().default(false),
    guestCount: integer("guest_count").notNull(),
    guestNames: jsonb("guest_names").$type<string[]>().notNull().default([]),
    menuChoice: varchar("menu_choice", { length: 64 }),
    dietaryRequirements: text("dietary_requirements"),
    message: text("message"),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    check(
      "rsvps_attendance_guest_count_check",
      sql`(${table.attendance} = 'attending' and ${table.guestCount} between 1 and 10 and (${table.fridayAttendance} or ${table.saturdayAttendance} or ${table.sundayAttendance})) or (${table.attendance} = 'declined' and ${table.guestCount} = 0 and not ${table.fridayAttendance} and not ${table.saturdayAttendance} and not ${table.sundayAttendance})`,
    ),
    index("rsvps_invitation_code_idx").on(table.invitationCode),
    index("rsvps_submitted_at_idx").on(table.submittedAt),
  ],
);

export type Rsvp = typeof rsvps.$inferSelect;
export type NewRsvp = typeof rsvps.$inferInsert;
