"use client";

import { type FormEvent, useState } from "react";

const eventOptions = [
  { name: "fridayAttendance", day: "Friday", detail: "9 July · Welcome aperitivo" },
  { name: "saturdayAttendance", day: "Saturday", detail: "10 July · Ceremony & dinner" },
  { name: "sundayAttendance", day: "Sunday", detail: "11 July · Beach recovery" },
] as const;

export function RsvpForm() {
  const [attendingAny, setAttendingAny] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const fridayAttendance = data.get("fridayAttendance") === "on";
    const saturdayAttendance = data.get("saturdayAttendance") === "on";
    const sundayAttendance = data.get("sundayAttendance") === "on";
    const hasEvent = fridayAttendance || saturdayAttendance || sundayAttendance;
    const personalNote = String(data.get("message") || "").trim();
    const bestTune = String(data.get("bestTune") || "").trim();

    const payload = {
      primaryGuestName: data.get("primaryGuestName"),
      email: data.get("email"),
      fridayAttendance,
      saturdayAttendance,
      sundayAttendance,
      guestCount: hasEvent ? 1 : 0,
      guestNames: [],
      menuChoice: hasEvent ? data.get("menuChoice") : null,
      dietaryRequirements: data.get("dietaryRequirements"),
      message: [personalNote, bestTune ? `Best tune: ${bestTune}` : ""].filter(Boolean).join("\n\n"),
    };

    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { error?: string; message?: string };

      if (!response.ok) throw new Error(result.error || "Your RSVP could not be saved.");

      setStatus("success");
      setMessage(result.message || "Grazie — your RSVP is safely in our guest book.");
      form.reset();
      setAttendingAny(false);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Your RSVP could not be saved.");
    }
  }

  function updateAttendance(form: HTMLFormElement) {
    const data = new FormData(form);
    setAttendingAny(eventOptions.some(({ name }) => data.get(name) === "on"));
  }

  return (
    <form className="rsvp-form" onSubmit={submitRsvp}>
      <div className="form-grid">
        <label>
          <span>Your name</span>
          <input name="primaryGuestName" autoComplete="name" required minLength={2} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" />
        </label>
      </div>

      <fieldset className="event-choices" onChange={(event) => updateAttendance(event.currentTarget.form!)}>
        <legend>Which moments will you join?</legend>
        {eventOptions.map(({ name, day, detail }) => (
          <label className="event-card" key={name}>
            <input type="checkbox" name={name} />
            <span className="event-card__check" aria-hidden="true">✓</span>
            <span className="event-card__copy"><strong>{day}</strong><small>{detail}</small></span>
          </label>
        ))}
      </fieldset>

      <fieldset className="menu-choices">
        <legend>Menu preferences</legend>
        <label className="menu-card">
          <input type="radio" name="menuChoice" value="Meat" required={attendingAny} />
          <span className="menu-card__check" aria-hidden="true">✓</span>
          <span className="menu-card__copy"><strong>Normal</strong><small>Meat &amp; Fish</small></span>
        </label>
        <label className="menu-card">
          <input type="radio" name="menuChoice" value="Vegetarian" required={attendingAny} />
          <span className="menu-card__check" aria-hidden="true">✓</span>
          <span className="menu-card__copy"><strong>Vegetarian</strong><small>Including cheese and dairy</small></span>
        </label>
      </fieldset>

      <label>
        <span>Allergies <em>Optional</em></span>
        <textarea name="dietaryRequirements" rows={3} placeholder="Please tell us anything the kitchen should know." />
      </label>
      <label>
        <span>A note for Jane &amp; Luca <em>Optional</em></span>
        <textarea name="message" rows={3} />
      </label>

      <label>
        <span>Add your best tune <em>Optional</em></span>
        <input name="bestTune" placeholder="Share your best music so we can blast it during our party." />
      </label>

      <button className="button button--yellow" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Saving…" : "Send our RSVP"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className={`form-status form-status--${status}`} role="status" aria-live="polite">{message}</p>
    </form>
  );
}
