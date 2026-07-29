import Image from "next/image";

import { FigmaNavigation } from "@/components/figma-navigation";
import { FigmaFooter } from "@/components/figma-page-shell";
import { ScrollReveal } from "@/components/scroll-reveal";

const events = [
  {
    date: "FRIDAY 9TH JULY",
    title: "Welcome Aperitivo",
    copy: "Join us from 5pm onwards for an aperitivo with a view. Sunset at 7pm, so don’t miss it!",
    place: <>Licciola<br />Route de Bastia, Lieu Dit Licciola<br />20226 Palasca, France</>,
  },
  {
    date: "SATURDAY 10TH JULY",
    title: "The Wedding",
    copy: "From 4pm until sunrise, join us for a night of celebrations!",
    place: <>Le Rocher<br />Lumio, Corsica</>,
  },
  {
    date: "SUNDAY 11TH JULY",
    title: "A slow goodbye",
    copy: "From 11am, a brunch and beach to restore your energy.",
    place: <>Le Rocher<br />Lumio, Corsica</>,
  },
];

export default function Home() {
  return (
    <main className="figma-home" id="top">
      <FigmaNavigation />

      <section className="figma-hero">
        <h1><span>Come celebrate</span><strong>with us in Corsica</strong></h1>
        <Image
          className="figma-hero__drawing"
          src="/assets/figma-home/image-1.png"
          alt="An illustrated couple embracing on the Corsican coast"
          width={1456}
          height={1092}
          priority
        />
        <div className="figma-hero__meta"><span>10TH JULY 2027</span><span>LUMIO, CORSICA</span></div>
      </section>

      <ScrollReveal className="figma-editorial-wrap">
      <section className="figma-editorial" id="information">
        <article>
          <div className="figma-photo"><Image src="/assets/figma-home/image-2.jpeg" alt="Corsican beach at dusk" fill sizes="(max-width: 760px) 94vw, 46vw" /></div>
          <div className="figma-editorial__copy"><h2>Three days, one island,<br />no rush.</h2><p>Plans worth looking forward to, with plenty of room left for long lunches and accidental swims.</p></div>
        </article>
        <article className="figma-editorial__reverse">
          <div className="figma-editorial__copy"><h2>Come for the wedding.<br />Stay for the island.</h2><p>Plans worth looking forward to, with plenty of room left for long lunches and accidental swims.</p></div>
          <div className="figma-photo"><Image src="/assets/figma-home/image-7.jpeg" alt="Corsican mountains and coast" fill sizes="(max-width: 760px) 94vw, 46vw" /></div>
        </article>
      </section>
      </ScrollReveal>

      <ScrollReveal>
      <section className="figma-programme">
        <h2>The Programme</h2>
        <div className="figma-programme__list">
          {events.map((event) => (
            <article key={event.title}>
              <p className="figma-event-date">{event.date}</p>
              <h3>{event.title}</h3>
              <p>{event.copy}</p>
              <span aria-hidden="true">📍</span>
              <address>{event.place}</address>
            </article>
          ))}
        </div>
        <p className="figma-more">We’ve added all the info on the following pages:</p>
        <div className="figma-actions">
          <a id="registry" href="/information">Information</a>
          <a id="rsvp" href="/rsvp">RSVP</a>
        </div>
      </section>
      </ScrollReveal>

      <section className="figma-hidden-targets" aria-label="More wedding information">
        <span id="story" />
        <span id="faq" />
      </section>

      <ScrollReveal>
        <section className="figma-signoff" aria-label="Farewell">
          <span>À bientôt</span>
          <strong>in Corsica</strong>
        </section>
      </ScrollReveal>

      <FigmaFooter />
    </main>
  );
}
