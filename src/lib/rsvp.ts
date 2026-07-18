export const menuChoices = ["Meat", "Fish", "Vegetarian", "Vegan"] as const;

export type RsvpInput = {
  primaryGuestName: string;
  email: string | null;
  fridayAttendance: boolean;
  saturdayAttendance: boolean;
  sundayAttendance: boolean;
  guestCount: number;
  guestNames: string[];
  menuChoice: (typeof menuChoices)[number] | null;
  dietaryRequirements: string | null;
  message: string | null;
};

export type RsvpValidationResult =
  | { ok: true; data: RsvpInput & { attendance: "attending" | "declined" } }
  | { ok: false; error: string };

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

export function validateRsvpInput(value: unknown): RsvpValidationResult {
  if (!value || typeof value !== "object") {
    return { ok: false, error: "Please complete the RSVP form." };
  }

  const input = value as Record<string, unknown>;
  const primaryGuestName = cleanText(input.primaryGuestName, 120);
  const email = cleanText(input.email, 320).toLowerCase() || null;
  const fridayAttendance = input.fridayAttendance === true;
  const saturdayAttendance = input.saturdayAttendance === true;
  const sundayAttendance = input.sundayAttendance === true;
  const isAttending = fridayAttendance || saturdayAttendance || sundayAttendance;
  const rawGuestCount = Number(input.guestCount);
  const guestCount = isAttending && Number.isInteger(rawGuestCount) ? rawGuestCount : 0;
  const submittedGuestNames = Array.isArray(input.guestNames)
    ? input.guestNames.map((name) => cleanText(name, 120)).filter(Boolean).slice(0, 9)
    : [];
  const submittedMenuChoice = menuChoices.includes(input.menuChoice as (typeof menuChoices)[number])
    ? (input.menuChoice as (typeof menuChoices)[number])
    : null;
  const guestNames = isAttending ? submittedGuestNames : [];
  const menuChoice = isAttending ? submittedMenuChoice : null;
  const dietaryRequirements = cleanText(input.dietaryRequirements, 1000) || null;
  const message = cleanText(input.message, 2000) || null;

  if (primaryGuestName.length < 2) {
    return { ok: false, error: "Please tell us your name." };
  }
  if (email && !emailPattern.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (isAttending && (guestCount < 1 || guestCount > 10)) {
    return { ok: false, error: "Party size must be between 1 and 10." };
  }
  if (isAttending && !menuChoice) {
    return { ok: false, error: "Please choose a menu preference." };
  }
  if (guestCount > 1 && guestNames.length !== guestCount - 1) {
    return { ok: false, error: "Please add the name of each additional guest." };
  }

  return {
    ok: true,
    data: {
      primaryGuestName,
      email,
      attendance: isAttending ? "attending" : "declined",
      fridayAttendance,
      saturdayAttendance,
      sundayAttendance,
      guestCount,
      guestNames,
      menuChoice,
      dietaryRequirements,
      message,
    },
  };
}
