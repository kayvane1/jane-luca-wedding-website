import { FigmaPageShell } from "@/components/figma-page-shell";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function RegistryPage() {
  return <FigmaPageShell className="registry-page"><ScrollReveal><section className="registry-page__content"><h1 className="type-h1">Your presence is<br /><em>the real present.</em></h1><p className="type-body type-intro">We are lucky to have everything we need at home. If you would still like to give, you can help us add a few unforgettable chapters to our honeymoon.</p><a href="https://www.ungrandjour.com/en/wedding-cash-fund" target="_blank" rel="noreferrer">Visit our honeymoon pot</a></section></ScrollReveal></FigmaPageShell>;
}
