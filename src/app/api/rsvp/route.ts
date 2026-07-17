import { NextResponse } from "next/server";

import { getDatabase } from "@/db/client";
import { rsvps } from "@/db/schema";
import { validateRsvpInput } from "@/lib/rsvp";

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
    const [created] = await getDatabase()
      .insert(rsvps)
      .values(result.data)
      .returning({ id: rsvps.id });

    return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
  } catch (error) {
    console.error("RSVP submission failed", error);
    return NextResponse.json(
      { error: "We could not save your RSVP just now. Please try again." },
      { status: 500 },
    );
  }
}
