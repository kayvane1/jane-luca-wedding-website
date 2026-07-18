import { eq, or, sql } from "drizzle-orm";

import { getDatabase } from "@/db/client";
import { type Rsvp, rsvps } from "@/db/schema";
import type { RsvpInput } from "@/lib/rsvp";

export type ValidatedRsvp = RsvpInput & {
  attendance: "attending" | "declined";
};

export type SaveRsvpResult =
  | {
      ok: true;
      action: "created" | "updated" | "unchanged";
      id: string;
      changes: string[];
      message: string;
    }
  | {
      ok: false;
      action: "conflict";
      message: string;
    };

const conflictMessage =
  "We found conflicting RSVP details for that name and email. Please contact Jane or Luca so we can update the right invitation.";

function nameKey(name: string) {
  return name.toLowerCase();
}

function sameList(left: string[], right: string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function formatList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function attendanceLabel(value: Rsvp["attendance"]) {
  return value === "attending" ? "attending" : "not attending";
}

function eventChange(day: string, attending: boolean) {
  return `your ${day} plans to ${attending ? "attending" : "not attending"}`;
}

function isUniqueViolation(error: unknown) {
  let current = error;

  for (let depth = 0; depth < 4 && current && typeof current === "object"; depth += 1) {
    if ("code" in current && current.code === "23505") return true;
    current = "cause" in current ? current.cause : undefined;
  }

  return false;
}

export function describeRsvpChanges(previous: Rsvp, next: ValidatedRsvp) {
  const changes: string[] = [];

  if (previous.primaryGuestName !== next.primaryGuestName) {
    changes.push(`the name on your RSVP to ${next.primaryGuestName}`);
  }
  if (previous.email !== next.email) {
    changes.push("your contact email");
  }
  if (previous.attendance !== next.attendance) {
    changes.push(
      `your attendance from ${attendanceLabel(previous.attendance)} to ${attendanceLabel(next.attendance)}`,
    );
  } else if (next.attendance === "attending") {
    if (previous.fridayAttendance !== next.fridayAttendance) {
      changes.push(eventChange("Friday", next.fridayAttendance));
    }
    if (previous.saturdayAttendance !== next.saturdayAttendance) {
      changes.push(eventChange("Saturday", next.saturdayAttendance));
    }
    if (previous.sundayAttendance !== next.sundayAttendance) {
      changes.push(eventChange("Sunday", next.sundayAttendance));
    }
    if (previous.guestCount !== next.guestCount) {
      const additionalGuests = Math.max(0, next.guestCount - 1);
      const guestDetail = ` (${additionalGuests} additional ${additionalGuests === 1 ? "guest" : "guests"})`;
      changes.push(
        `your party size from ${previous.guestCount} to ${next.guestCount}${guestDetail}`,
      );
    }
    if (!sameList(previous.guestNames, next.guestNames)) {
      changes.push("your additional guest details");
    }
    if (previous.menuChoice !== next.menuChoice) {
      changes.push(`your menu preference from ${previous.menuChoice} to ${next.menuChoice}`);
    }
  }
  if (previous.dietaryRequirements !== next.dietaryRequirements) {
    changes.push("your dietary notes");
  }
  if (previous.message !== next.message) {
    changes.push("your note for Jane and Luca");
  }

  return changes;
}

async function findIdentityMatches(input: ValidatedRsvp) {
  const emailCondition = input.email
    ? sql`lower(${rsvps.email}) = ${input.email}`
    : undefined;
  const nameCondition = sql`lower(${rsvps.primaryGuestName}) = ${nameKey(input.primaryGuestName)}`;

  return getDatabase()
    .select()
    .from(rsvps)
    .where(emailCondition ? or(emailCondition, nameCondition) : nameCondition);
}

function resolveIdentityMatch(matches: Rsvp[], input: ValidatedRsvp) {
  const byEmail = input.email
    ? matches.find((row) => row.email?.toLowerCase() === input.email)
    : undefined;
  const byName = matches.find(
    (row) => nameKey(row.primaryGuestName) === nameKey(input.primaryGuestName),
  );

  if (byEmail && byName && byEmail.id !== byName.id) return "conflict" as const;
  if (byName?.email && input.email && byName.email.toLowerCase() !== input.email) {
    return "conflict" as const;
  }

  return byEmail ?? byName;
}

async function updateExisting(previous: Rsvp, input: ValidatedRsvp): Promise<SaveRsvpResult> {
  const changes = describeRsvpChanges(previous, input);
  if (changes.length === 0) {
    return {
      ok: true,
      action: "unchanged",
      id: previous.id,
      changes,
      message: "We already have this RSVP — nothing has changed.",
    };
  }

  try {
    await getDatabase()
      .update(rsvps)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(rsvps.id, previous.id));
  } catch (error) {
    // Another request can claim the new email or name after our identity read.
    // Return the same safe conflict response instead of exposing a database error.
    if (isUniqueViolation(error)) {
      return { ok: false, action: "conflict", message: conflictMessage };
    }
    throw error;
  }

  return {
    ok: true,
    action: "updated",
    id: previous.id,
    changes,
    message: `Thank you — we've updated your RSVP: ${formatList(changes)}.`,
  };
}

export async function saveRsvp(input: ValidatedRsvp): Promise<SaveRsvpResult> {
  const existingResolution = resolveIdentityMatch(await findIdentityMatches(input), input);
  if (existingResolution === "conflict") {
    return { ok: false, action: "conflict", message: conflictMessage };
  }
  if (existingResolution) return updateExisting(existingResolution, input);

  const [created] = await getDatabase()
    .insert(rsvps)
    .values(input)
    .onConflictDoNothing()
    .returning({ id: rsvps.id });

  if (created) {
    return {
      ok: true,
      action: "created",
      id: created.id,
      changes: [],
      message: "Grazie — your RSVP is safely in our guest book.",
    };
  }

  // A concurrent request won the insert. Re-read it and treat this request as
  // an update, while preserving the same ambiguity checks as the normal path.
  const concurrentResolution = resolveIdentityMatch(await findIdentityMatches(input), input);
  if (concurrentResolution === "conflict") {
    return { ok: false, action: "conflict", message: conflictMessage };
  }
  if (concurrentResolution) return updateExisting(concurrentResolution, input);

  throw new Error("RSVP insert conflicted but no matching RSVP could be found");
}
