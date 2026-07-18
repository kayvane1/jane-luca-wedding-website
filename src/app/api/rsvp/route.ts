import { NextResponse } from "next/server";

import { validateRsvpInput } from "@/lib/rsvp";
import { saveRsvp } from "@/lib/rsvp-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "The RSVP could not be read." }, { status: 400 });
  }

  const result = validateRsvpInput(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    const saved = await saveRsvp(result.data);
    if (!saved.ok) {
      return NextResponse.json(
        { error: saved.message, action: saved.action },
        { status: 409 },
      );
    }

    return NextResponse.json(saved, { status: saved.action === "created" ? 201 : 200 });
  } catch (error) {
    console.error("RSVP submission failed", error);
    return NextResponse.json(
      { error: "We could not save your RSVP just now. Please try again." },
      { status: 500 },
    );
  }
}
