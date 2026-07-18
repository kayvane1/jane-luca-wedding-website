import { config } from "dotenv";
import { eq } from "drizzle-orm";

import { getDatabase } from "../src/db/client";
import { rsvps } from "../src/db/schema";

config({ path: ".env.local" });

const db = getDatabase();
let testRecordId: string | undefined;

try {
  const [inserted] = await db
    .insert(rsvps)
    .values({
      primaryGuestName: "Database smoke test",
      attendance: "attending",
      fridayAttendance: true,
      guestCount: 1,
      guestNames: [],
      menuChoice: "Vegetarian",
    })
    .returning({ id: rsvps.id });

  if (!inserted) {
    throw new Error("The smoke-test RSVP was not inserted");
  }

  testRecordId = inserted.id;

  const [stored] = await db
    .select({ id: rsvps.id, attendance: rsvps.attendance })
    .from(rsvps)
    .where(eq(rsvps.id, inserted.id));

  if (!stored || stored.attendance !== "attending") {
    throw new Error("The smoke-test RSVP could not be read back correctly");
  }

  console.log("Database smoke test passed: insert and read succeeded.");
} finally {
  if (testRecordId) {
    await db.delete(rsvps).where(eq(rsvps.id, testRecordId));
    console.log("Database smoke test cleanup passed: test record deleted.");
  }
}
