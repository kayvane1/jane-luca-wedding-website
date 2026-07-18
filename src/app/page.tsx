import Image from "next/image";

import { CinematicHero } from "@/components/cinematic-hero";
import { Reveal } from "@/components/reveal";
import { RsvpForm } from "@/components/rsvp-form";
import { SiteNavigation } from "@/components/site-navigation";

const faqs = [
  [
    "Which airport should I fly to?",
    "Calvi–Sainte-Catherine is the gateway to the Balagne region and the most natural arrival point for Lumio. Routes can be seasonal, so compare current flights before booking; Bastia is the usual alternative for a wider choice.",
  ],
  [
    "Where should I stay?",
    "Lumio, Calvi and L’Île-Rousse all make good bases for the weekend. We’ll add a short, practical list of hotels, villas and apartments when invitations go out.",
  ],
  [
    "Will I need a car?",
    "We recommend hiring one. It gives you freedom between the airport, coast and villages; plans for transport around the main celebration will follow with the final schedule.",
  ],
  [
    "What should I do while I’m there?",
    "Walk Calvi’s citadel, follow the path to the ruined village of Occi above Lumio, spend a morning in L’Île-Rousse, or explore the villages and artisans of the Balagne.",
  ],
  [
    "What should I wear?",
    "Summer formal, with personality. Think light tailoring, long dresses, colour and shoes that can handle stone paths as well as a dance floor.",
  ],
];

type SketchCardProps = {
  alt: string;
  className: string;
  sizes: string;
  src: string;
};

function SketchCard({ alt, className, sizes, src }: SketchCardProps) {
  return (
    <figure className={`sketch-card ${className}`}>
      <Image src={src} fill sizes={sizes} alt={alt} />
    </figure>
  );
}

export default function Home() {
  return (
    <main>
      <SiteNavigation />
      <CinematicHero />

      <section className="information" id="information">
        <header className="section-intro">
          <p className="eyebrow">The weekend</p>
          <h2>Come for the wedding.<br /><em>Stay for the island.</em></h2>
          <p>Plans worth looking forward to, with plenty of room left for long lunches and accidental swims.</p>
          <SketchCard
            className="section-intro__sketch"
            src="/assets/sketches/champagne-coupes-sketch.jpg"
            sizes="(max-width: 820px) 62vw, 27vw"
            alt="A pencil drawing of two champagne coupes"
          />
        </header>

        <article className="info-panel info-panel--program">
          <SketchCard
            className="programme-sketch"
            src="/assets/sketches/corsica-tower-sketch.jpg"
            sizes="(max-width: 820px) 76vw, 32vw"
            alt="A pencil drawing of a stone watchtower on the Corsican coast"
          />
          <Reveal variant="slide-left" className="info-panel__aside">
            <span className="section-number">01 / 04</span>
            <p className="eyebrow">Programme</p>
            <p className="handwritten">the long weekend begins here</p>
          </Reveal>
          <Reveal variant="slide-right" className="info-panel__main">
            <h3>Three days,<br />one island,<br /><em>no rush.</em></h3>
            <div className="event-list">
              <div className="event-line">
                <p><span>Friday</span>Welcome aperitivo</p>
                <address>Licciola<br />Route de Bastia, Lieu Dit Licciola<br />20226 Palasca, France</address>
                <a href="https://www.google.com/maps/search/?api=1&query=Licciola%2C+Route+de+Bastia%2C+Lieu+Dit+Licciola%2C+20226+Palasca%2C+France" target="_blank" rel="noreferrer">Open map ↗</a>
              </div>
              <div className="event-line">
                <p><span>Saturday</span>The wedding</p>
                <address>Le Rocher<br />Lumio, Corsica</address>
                <a href="https://www.google.com/maps/search/?api=1&query=Le+Rocher%2C+Lumio%2C+Corsica" target="_blank" rel="noreferrer">Open map ↗</a>
              </div>
              <div className="event-line">
                <p><span>Sunday</span>A slow goodbye</p>
                <address>Details to follow<br />with your invitation</address>
              </div>
            </div>
          </Reveal>
        </article>

        <article className="info-panel info-panel--stay">
          <Reveal variant="wipe" className="info-panel__main">
            <span className="section-number">02 / 04</span>
            <p className="eyebrow">Where to stay</p>
            <h3>Check in.<br /><em>Then exhale.</em></h3>
            <SketchCard
              className="stay-sketch"
              src="/assets/sketches/mediterranean-villa-sketch.jpg"
              sizes="(max-width: 820px) 80vw, 32vw"
              alt="A pencil drawing of a Mediterranean villa and pool"
            />
            <div className="editorial-columns">
              <p>Lumio, Calvi and L’Île-Rousse place you close to the celebrations and the best of the Balagne coast.</p>
              <p>Choose a small hotel, share a villa or find an apartment with a balcony. Our considered shortlist is coming with the invitations.</p>
            </div>
            <p className="location-run">Lumio — Calvi — L’Île-Rousse — Balagne</p>
          </Reveal>
        </article>

        <article className="info-panel info-panel--transport">
          <Reveal variant="slide-left" className="info-panel__aside">
            <span className="section-number">03 / 04</span>
            <p className="eyebrow">Transport</p>
          </Reveal>
          <Reveal variant="slide-right" className="info-panel__main">
            <h3>Windows down.<br /><em>Coast ahead.</em></h3>
            <SketchCard
              className="transport-sketch"
              src="/assets/sketches/palm-frond-sketch.jpg"
              sizes="(max-width: 820px) 72vw, 28vw"
              alt="A pencil drawing of a palm frond against distant mountains"
            />
            <div className="editorial-columns">
              <p>Calvi–Sainte-Catherine is the closest airport and the gateway to the Balagne. Bastia is the useful alternative when its schedules suit you better.</p>
              <p>A hire car is the simplest way to reach Lumio, Palasca and the villages in between. Wedding-day transport details will follow.</p>
            </div>
            <a className="text-link" href="https://calvi-aeroport.cci.corsica/en/" target="_blank" rel="noreferrer">Check Calvi airport ↗</a>
          </Reveal>
        </article>

        <article className="info-panel info-panel--theme">
          <Reveal variant="lift" className="info-panel__main">
            <span className="section-number">04 / 04</span>
            <p className="eyebrow">The mood</p>
            <h3>Mediterranean evening,<br /><em>dressed with joy.</em></h3>
            <SketchCard
              className="theme-sketch"
              src="/assets/sketches/olive-tree-coast-sketch.jpg"
              sizes="(max-width: 820px) 86vw, 55vw"
              alt="A pencil drawing of an olive tree beside the Corsican sea"
            />
            <p className="theme-copy">Summer formal, never stiff: light tailoring, long dresses, colour, beautiful shoes you can still dance in, and whatever makes you feel most like yourself.</p>
          </Reveal>
        </article>
      </section>

      <section className="rsvp-section" id="rsvp">
        <Reveal className="rsvp-section__intro" variant="slide-left">
          <p className="eyebrow">Répondez s’il vous plaît</p>
          <h2>Save your<br /><em>seat by the sea.</em></h2>
          <p>Tell us which moments you can join. If the answer is none this time, we’ll miss you — and still raise a glass in your direction.</p>
          <span className="handwritten">we really hope you can make it</span>
        </Reveal>
        <Reveal className="rsvp-section__form" variant="slide-right">
          <RsvpForm />
        </Reveal>
      </section>

      <section className="registry" id="registry">
        <Reveal className="registry__content" variant="wipe">
          <p className="eyebrow">Registry</p>
          <h2>Your presence is<br /><em>the real present.</em></h2>
          <p>We’re lucky to have all we need at home. If you would still like to give, you can help us add a few unforgettable chapters to our honeymoon.</p>
          <a className="button button--accent" href="https://www.collectionpot.com/occasion/honeymoon-fund/" target="_blank" rel="noreferrer">
            Visit our honeymoon pot <span aria-hidden="true">↗</span>
          </a>
          <small>Our personal Collection Pot link will be added before invitations go out.</small>
        </Reveal>
      </section>

      <section className="story" id="story">
        <Reveal className="story__visual" variant="slide-left">
          <SketchCard
            className="story-sketch story-sketch--olive"
            src="/assets/sketches/olive-tree-coast-sketch.jpg"
            sizes="(max-width: 820px) 80vw, 36vw"
            alt="A pencil drawing of an old olive tree facing the sea"
          />
          <SketchCard
            className="story-sketch story-sketch--tower"
            src="/assets/sketches/corsica-tower-sketch.jpg"
            sizes="(max-width: 820px) 48vw, 18vw"
            alt="A pencil drawing of a Corsican stone tower by the sea"
          />
          <span className="handwritten">and then there were two</span>
        </Reveal>
        <Reveal className="story__copy" variant="slide-right">
          <p className="eyebrow">Our story</p>
          <h2>Two paths,<br /><em>one very good idea.</em></h2>
          <p className="dropcap">Jane and Luca met in the sort of way that now feels inevitable: one conversation became another, plans stretched later, and very quickly life was better shared.</p>
          <p>Since then there have been new cities, old friends, excellent meals and more luggage than any two people reasonably need. Corsica feels like the right place to begin the next chapter — close to the sea and with all of you there.</p>
          <p className="story__signoff">See you on the island,<br /><em>J &amp; L</em></p>
        </Reveal>
      </section>

      <section className="faq" id="faq">
        <div className="faq__heading">
          <p className="eyebrow">Good to know</p>
          <h2>Questions,<br /><em>answered.</em></h2>
        </div>
        <div className="faq__list">
          {faqs.map(([question, answer], index) => (
            <details key={question}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span>{question}<i aria-hidden="true">+</i></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <footer className="footer">
        <p className="eyebrow">Jane &amp; Luca</p>
        <h2>À bientôt<br /><em>in Corsica.</em></h2>
        <div className="footer__bottom">
          <p>Le Rocher — Lumio</p>
          <span className="playlist-placeholder">Spotify playlist coming soon ♫</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
