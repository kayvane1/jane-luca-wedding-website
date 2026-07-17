import assert from "node:assert/strict";

import { validateRsvpInput } from "../src/lib/rsvp";

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

console.log("RSVP validation tests passed.");
