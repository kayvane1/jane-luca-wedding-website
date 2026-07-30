import { FigmaPageShell } from "@/components/figma-page-shell";

const faqs = [
  ["Which airport should I fly to?", "Calvi is closest to Lumio; Bastia often offers a wider range of flights."],
  ["Where should I stay?", "Lumio, Calvi and L’Île-Rousse all make good bases for the weekend. We’ve added a practical list on the Information page."],
  ["Will I need a car?", "We recommend one for exploring the coast and villages. Wedding-night shuttle details will follow."],
  ["What should I wear?", "Summer formal with personality: colour, light tailoring, long dresses and shoes suitable for stone paths."],
  ["Can I bring a plus one?", "Please follow the guest names on your invitation, or contact us if anything is unclear."],
  ["Can I bring kids?", "Please follow the details on your invitation; we’ll be happy to answer any family-specific questions."],
  ["Until what time is the wedding?", "We plan to celebrate until sunrise."],
] as const;

export default function FaqPage() {
  return <FigmaPageShell className="faq-page"><section className="faq-page__layout"><h1 className="type-h1">Questions,<br />answered.</h1><div className="faq-page__list">{faqs.map(([question, answer], index) => <details key={question}><summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i aria-hidden="true">+</i></summary><p className="type-body">{answer}</p></details>)}</div></section></FigmaPageShell>;
}
