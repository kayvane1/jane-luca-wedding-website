import assert from "node:assert/strict";

import type { Rsvp } from "../src/db/schema";
import { validateRsvpInput } from "../src/lib/rsvp";
import { describeRsvpChanges } from "../src/lib/rsvp-store";

const attending = validateRsvpInput({
  primaryGuestName: "Jane Example",
  email: "jane@example.com",
  fridayAttendance: true,
  saturdayAttendance: true,
  sundayAttendance: false,
  guestCount: 2,
  guestNames: ["Luca Example"],
  menuChoice: "Fish",
  dietaryRequirements: "No shellfish",
});

assert.equal(attending.ok, true);
if (attending.ok) {
  assert.equal(attending.data.attendance, "attending");
  assert.equal(attending.data.guestCount, 2);
  assert.deepEqual(attending.data.guestNames, ["Luca Example"]);
}

const declined = validateRsvpInput({
  primaryGuestName: "A Friend",
  fridayAttendance: false,
  saturdayAttendance: false,
  sundayAttendance: false,
  guestCount: 4,
  guestNames: ["Ignored Guest"],
});

assert.equal(declined.ok, true);
if (declined.ok) {
  assert.equal(declined.data.attendance, "declined");
  assert.equal(declined.data.guestCount, 0);
}

const missingMenu = validateRsvpInput({
  primaryGuestName: "A Friend",
  saturdayAttendance: true,
  guestCount: 1,
});
assert.deepEqual(missingMenu, { ok: false, error: "Please choose a menu preference." });

const missingGuest = validateRsvpInput({
  primaryGuestName: "A Friend",
  saturdayAttendance: true,
  guestCount: 2,
  guestNames: [],
  menuChoice: "Vegan",
});
assert.deepEqual(missingGuest, { ok: false, error: "Please add the name of each additional guest." });

const normalizedEmail = validateRsvpInput({
  primaryGuestName: "  Jane   Example  ",
  email: " JANE@Example.COM ",
  fridayAttendance: false,
});
assert.equal(normalizedEmail.ok, true);
if (normalizedEmail.ok) {
  assert.equal(normalizedEmail.data.primaryGuestName, "Jane Example");
  assert.equal(normalizedEmail.data.email, "jane@example.com");
}

const declinedWithStaleDetails = validateRsvpInput({
  primaryGuestName: "A Friend",
  fridayAttendance: false,
  guestCount: 3,
  guestNames: ["One", "Two"],
  menuChoice: "Meat",
});
assert.equal(declinedWithStaleDetails.ok, true);
if (declinedWithStaleDetails.ok) {
  assert.equal(declinedWithStaleDetails.data.menuChoice, null);
  assert.deepEqual(declinedWithStaleDetails.data.guestNames, []);
}

const previous = {
  id: "00000000-0000-0000-0000-000000000001",
  invitationCode: null,
  primaryGuestName: "Jane Example",
  email: "jane@example.com",
  attendance: "attending",
  fridayAttendance: true,
  saturdayAttendance: true,
  sundayAttendance: false,
  guestCount: 1,
  guestNames: [],
  menuChoice: "Meat",
  dietaryRequirements: null,
  message: null,
  submittedAt: new Date(0),
  updatedAt: new Date(0),
} satisfies Rsvp;

const changes = describeRsvpChanges(previous, {
  primaryGuestName: "Jane Example",
  email: "jane@example.com",
  attendance: "attending",
  fridayAttendance: true,
  saturdayAttendance: true,
  sundayAttendance: false,
  guestCount: 3,
  guestNames: ["Luca Example", "Guest Example"],
  menuChoice: "Vegetarian",
  dietaryRequirements: null,
  message: null,
});
assert.deepEqual(changes, [
  "your party size from 1 to 3 (2 additional guests)",
  "your additional guest details",
  "your menu preference from Meat to Vegetarian",
]);

console.log("RSVP validation tests passed.");
