import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

import { config } from "dotenv";
import { count, eq, or, sql } from "drizzle-orm";

import { getDatabase } from "../src/db/client";
import { rsvps } from "../src/db/schema";
import type { ValidatedRsvp } from "../src/lib/rsvp-store";
import { saveRsvp } from "../src/lib/rsvp-store";

config({ path: ".env.local" });

const marker = `codex-battle-${randomUUID()}`;
const db = getDatabase();

function input(overrides: Partial<ValidatedRsvp> = {}): ValidatedRsvp {
  return {
    primaryGuestName: `${marker} Primary`,
    email: `${marker}@example.com`,
    attendance: "attending",
    fridayAttendance: true,
    saturdayAttendance: true,
    sundayAttendance: false,
    guestCount: 1,
    guestNames: [],
    menuChoice: "Meat",
    dietaryRequirements: null,
    message: null,
    ...overrides,
  };
}

async function matchingCount() {
  const [result] = await db
    .select({ value: count() })
    .from(rsvps)
    .where(
      or(
        sql`${rsvps.primaryGuestName} like ${`${marker}%`}`,
        sql`${rsvps.email} like ${`${marker}%`}`,
      ),
    );
  return result.value;
}

async function main() {
  try {
    const created = await saveRsvp(input());
    assert.equal(created.ok, true);
    assert.equal(created.action, "created");
    assert.equal(await matchingCount(), 1);

    const unchanged = await saveRsvp(input());
    assert.equal(unchanged.ok, true);
    assert.equal(unchanged.action, "unchanged");
    assert.equal(unchanged.ok && unchanged.id, created.ok && created.id);
    assert.match(unchanged.message, /nothing has changed/i);
    assert.equal(await matchingCount(), 1);

    const menuUpdate = await saveRsvp(input({ menuChoice: "Vegetarian" }));
    assert.equal(menuUpdate.action, "updated");
    assert.match(menuUpdate.message, /menu preference from Meat to Vegetarian/);

    const guestUpdate = await saveRsvp(
      input({
        menuChoice: "Vegetarian",
        guestCount: 3,
        guestNames: [`${marker} Guest One`, `${marker} Guest Two`],
      }),
    );
    assert.equal(guestUpdate.action, "updated");
    assert.match(guestUpdate.message, /2 additional guests/);

    const caseInsensitiveRepeat = await saveRsvp(
      input({
        primaryGuestName: `${marker.toUpperCase()} PRIMARY`,
        menuChoice: "Vegetarian",
        guestCount: 3,
        guestNames: [`${marker} Guest One`, `${marker} Guest Two`],
      }),
    );
    assert.notEqual(caseInsensitiveRepeat.action, "created");
    assert.equal(await matchingCount(), 1);

    const declined = await saveRsvp(
      input({
        attendance: "declined",
        fridayAttendance: false,
        saturdayAttendance: false,
        guestCount: 0,
        guestNames: [],
        menuChoice: null,
      }),
    );
    assert.equal(declined.action, "updated");
    assert.match(declined.message, /attendance from attending to not attending/);

    const concurrentName = `${marker} Concurrent`;
    const concurrentEmail = `${marker}-concurrent@example.com`;
    const concurrentResults = await Promise.all(
      Array.from({ length: 4 }, () =>
        saveRsvp(input({ primaryGuestName: concurrentName, email: concurrentEmail })),
      ),
    );
    assert.equal(concurrentResults.filter((result) => result.action === "created").length, 1);

    const [concurrentCount] = await db
      .select({ value: count() })
      .from(rsvps)
      .where(eq(rsvps.email, concurrentEmail));
    assert.equal(concurrentCount.value, 1);

    const personA = input({
      primaryGuestName: `${marker} Person A`,
      email: `${marker}-a@example.com`,
    });
    const personB = input({
      primaryGuestName: `${marker} Person B`,
      email: `${marker}-b@example.com`,
    });
    assert.equal((await saveRsvp(personA)).action, "created");
    assert.equal((await saveRsvp(personB)).action, "created");

    const ambiguous = await saveRsvp({
      ...personA,
      primaryGuestName: personB.primaryGuestName,
    });
    assert.equal(ambiguous.ok, false);
    assert.equal(ambiguous.action, "conflict");
    assert.match(ambiguous.message, /contact Jane or Luca/);

    console.log(
      "RSVP battle test passed: create, repeat, update, decline, concurrency, and conflict behavior verified.",
    );
  } finally {
    await db.delete(rsvps).where(
      or(
        sql`${rsvps.primaryGuestName} like ${`${marker}%`}`,
        sql`${rsvps.email} like ${`${marker}%`}`,
      ),
    );
    assert.equal(await matchingCount(), 0);
    console.log("RSVP battle-test cleanup passed: all generated records deleted.");
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
