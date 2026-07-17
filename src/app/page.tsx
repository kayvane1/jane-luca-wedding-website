import Image from "next/image";

import { Reveal } from "@/components/reveal";
import { RsvpForm } from "@/components/rsvp-form";
import { SiteNavigation } from "@/components/site-navigation";

const information = [
  {
    number: "01",
    eyebrow: "The weekend",
    title: "Three days, one island, no rush.",
    copy: "We begin with an easy Friday aperitivo, gather for the ceremony and dinner on Saturday, then meet the sea again for a slow Sunday recovery. Exact times and addresses will follow with your invitation.",
    note: "Friday — Sunday",
    variant: "slide-left" as const,
    className: "info-panel--blue",
  },
  {
    number: "02",
    eyebrow: "Where to stay",
    title: "Make a little holiday of it.",
    copy: "We’ll share the best towns and a short list of hotels, villas and apartments once the venue details are final. There will be options for every sort of group — booking early is the one piece of serious advice we have.",
    note: "Recommendations coming soon",
    variant: "slide-right" as const,
    className: "info-panel--cream",
  },
  {
    number: "03",
    eyebrow: "Getting around",
    title: "Windows down, coast ahead.",
    copy: "A hire car is the easiest way to explore Corsica and reach the celebrations. We’ll share airport transfer and wedding-day shuttle details nearer the date, so nobody needs to negotiate mountain roads after midnight.",
    note: "Car hire recommended",
    variant: "wipe" as const,
    className: "info-panel--orange",
  },
  {
    number: "04",
    eyebrow: "The theme",
    title: "Mediterranean evening, dressed with joy.",
    copy: "Think summer tailoring, long dresses, colour and shoes made for dancing. The mood is elegant but never stiff: cobalt water, citrus at the table and that golden hour Corsica does so well.",
    note: "Summer formal",
    variant: "lift" as const,
    className: "info-panel--navy",
  },
];

const faqs = [
  ["Which airport should I fly to?", "We’ll confirm the best airport when we share the exact venue. Your invitation will include the simplest routes, transfer options and realistic drive times."],
  ["Do I need to hire a car?", "For most guests, yes. Corsica rewards a little independence, and a car makes beaches, villages and airport transfers much easier. We’ll organise transport around the main celebration."],
  ["What should I do while I’m there?", "Swim at Palombaggia, wander Bonifacio’s old town, take a boat through the Lavezzi Islands, and leave time for a long lunch under the pines."],
  ["Can children join the celebrations?", "We’re still finalising the guest plan. Your invitation will make clear who is included, and we’ll help parents with local childcare recommendations if needed."],
  ["When do we need to RSVP?", "The final RSVP date will be printed on your invitation. If plans change after you reply, please contact Jane or Luca directly."],
];

export default function Home() {
  return (
    <main>
      <SiteNavigation />

      <section className="hero" id="home">
        <div className="hero__sun" aria-hidden="true" />
        <div className="hero__stripe" aria-hidden="true" />
        <p className="hero__kicker">Jane &amp; Luca invite you to</p>
        <Image
          className="hero__monogram"
          src="/assets/jl-monogram.png"
          width={900}
          height={560}
          priority
          alt="Jane and Luca monogram"
        />
        <h1>A Mediterranean<br />wedding in Corsica</h1>
        <div className="hero__details">
          <p>Corsica<br />France</p>
          <p className="hero__date">The date<br />Coming soon</p>
        </div>
        <a className="scroll-cue" href="#information"><span>Scroll for the weekend</span><i aria-hidden="true">↓</i></a>
      </section>

      <section className="information" id="information">
        <header className="section-intro">
          <p className="eyebrow">Information</p>
          <h2>Come for the wedding.<br /><em>Stay for the island.</em></h2>
          <p>Everything you need for a long weekend under the Corsican sun.</p>
        </header>
        {information.map((item) => (
          <article className={`info-panel ${item.className}`} key={item.number}>
            <Reveal variant={item.variant} className="info-panel__inner">
              <div className="info-panel__topline"><span>{item.number}</span><span>{item.eyebrow}</span></div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <span className="info-panel__note">{item.note}</span>
            </Reveal>
          </article>
        ))}
      </section>

      <section className="rsvp-section" id="rsvp">
        <Reveal className="rsvp-section__intro" variant="slide-left">
          <p className="eyebrow">Répondez s’il vous plaît</p>
          <h2>Save your<br /><em>seat in the sun.</em></h2>
          <p>Tell us which parts of the weekend you can join. If the answer is none this time, we’ll miss you — and still raise a glass in your direction.</p>
          <div className="lemon-mark" aria-hidden="true"><span>J&amp;L</span></div>
        </Reveal>
        <Reveal className="rsvp-section__form" variant="slide-right">
          <RsvpForm />
        </Reveal>
      </section>

      <section className="registry" id="registry">
        <div className="registry__pattern" aria-hidden="true" />
        <Reveal className="registry__content" variant="wipe">
          <p className="eyebrow">Registry</p>
          <h2>Your presence is<br /><em>the real present.</em></h2>
          <p>We’re lucky to have all we need at home. If you would still like to give, you can help us fill our honeymoon with a few unforgettable chapters.</p>
          <a className="button button--navy" href="https://www.collectionpot.com/occasion/honeymoon-fund/" target="_blank" rel="noreferrer">
            Visit our honeymoon pot <span aria-hidden="true">↗</span>
          </a>
          <small>Our personal Collection Pot link will be added before invitations go out.</small>
        </Reveal>
      </section>

      <section className="story" id="story">
        <Reveal className="story__title" variant="slide-left">
          <p className="eyebrow">Our story</p>
          <h2>Two paths,<br /><em>one very good idea.</em></h2>
        </Reveal>
        <Reveal className="story__copy" variant="slide-right">
          <p className="dropcap">Jane and Luca met in the sort of way that now feels inevitable: one conversation became another, plans stretched later, and very quickly life was better shared.</p>
          <p>Since then there have been new cities, old friends, excellent meals and more luggage than any two people reasonably need. Corsica feels like the perfect place to begin the next chapter — close to the sea, full of family, and with all of you there.</p>
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
        <div className="footer__top">
          <p>Jane &amp; Luca</p>
          <h2>À bientôt<br /><em>in Corsica.</em></h2>
        </div>
        <div className="footer__bottom">
          <p>Corsica — date to be announced</p>
          <span className="playlist-placeholder">Spotify playlist coming soon <span aria-hidden="true">♫</span></span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
