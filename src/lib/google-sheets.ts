import type { RsvpInput } from "@/lib/rsvp";

type SheetSyncInput = {
  id: string;
  action: "created" | "updated" | "unchanged";
  data: RsvpInput & { attendance: "attending" | "declined" };
};

function separateMessageAndTune(message: string | null) {
  if (!message) return { message: null, bestTune: null };

  const marker = /(?:^|\s+)Best tune:\s*/gi;
  let markerMatch: RegExpExecArray | null = null;
  let nextMatch: RegExpExecArray | null;

  while ((nextMatch = marker.exec(message)) !== null) {
    markerMatch = nextMatch;
  }

  if (!markerMatch) return { message, bestTune: null };

  return {
    message: message.slice(0, markerMatch.index).trim() || null,
    bestTune: message.slice(markerMatch.index + markerMatch[0].length).trim() || null,
  };
}

export async function syncRsvpToGoogleSheet({ id, action, data }: SheetSyncInput) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

  if (!webhookUrl || !secret) return { ok: false as const, reason: "not-configured" as const };

  const note = separateMessageAndTune(data.message);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        id,
        action,
        submittedOrUpdatedAt: new Date().toISOString(),
        primaryGuestName: data.primaryGuestName,
        attendance: data.attendance,
        fridayAttendance: data.fridayAttendance,
        saturdayAttendance: data.saturdayAttendance,
        sundayAttendance: data.sundayAttendance,
        guestCount: data.guestCount,
        guestNames: data.guestNames,
        menuChoice: data.menuChoice,
        dietaryRequirements: data.dietaryRequirements,
        message: note.message,
        bestTune: note.bestTune,
        email: data.email,
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Google Sheets webhook returned ${response.status}`);
    const responseBody = (await response.json()) as { ok?: boolean; error?: string };
    if (!responseBody.ok) {
      throw new Error(responseBody.error || "Google Sheets webhook rejected the RSVP");
    }
    return { ok: true as const };
  } catch (error) {
    console.error("RSVP was saved, but Google Sheets sync failed", error);
    return { ok: false as const, reason: "request-failed" as const };
  } finally {
    clearTimeout(timeout);
  }
}
