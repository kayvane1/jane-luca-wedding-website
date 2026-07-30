import { FigmaPageShell } from "@/components/figma-page-shell";
import { RsvpForm } from "@/components/rsvp-form";

export default function RsvpPage() {
  return <FigmaPageShell className="rsvp-page"><section className="rsvp-page__layout"><div className="rsvp-page__intro"><h1 className="type-h1">Save your seat<br />by the sea.</h1><p className="type-body type-intro">Tell us which moments you can join. If you cannot make it this time, we will miss you and raise a glass in your direction.</p></div><div className="rsvp-page__form"><RsvpForm /></div></section></FigmaPageShell>;
}
