import Image from "next/image";

import { FigmaPageShell } from "@/components/figma-page-shell";
import { ScrollReveal } from "@/components/scroll-reveal";

const programme = [
  ["FRIDAY 9TH JULY", "Welcome Aperitivo", "Join us from 5pm onwards for an aperitivo with a view.", "Licciola · Palasca", "/assets/figma-information/image-5.jpeg"],
  ["SATURDAY 10TH JULY", "The Wedding", "From 4pm until sunrise, join us for a night of celebrations!", "Le Rocher · Lumio", "/assets/figma-information/image-2.jpeg"],
  ["SUNDAY 11TH JULY", "A slow goodbye", "Brunch and beach from 11am to restore your energy.", "Le Rocher · Lumio", "/assets/figma-information/image-3.png"],
] as const;

const stays = [
  {
    name: "Hôtel La Caravelle",
    location: "Calvi",
    description: "A relaxed hotel beside Calvi’s beach and pine grove, within easy reach of the old town.",
    href: "https://www.hotel-la-caravelle.com/index.html",
    image: "/assets/stays/hotel-la-caravelle.jpg",
  },
  {
    name: "Casa Rossa",
    location: "L’Île-Rousse",
    description: "A peaceful hotel around 300 metres from the town centre and beach.",
    href: "https://www.hotel-casarossa.com/",
    image: "/assets/stays/casa-rossa.jpg",
  },
  {
    name: "Casa a Scopa",
    location: "Lumio",
    description: "A small guest house in Lumio with a sea-view pool and a more intimate feel.",
    href: "https://villalumio.com/",
    image: "/assets/stays/casa-a-scopa.jpg",
  },
  {
    name: "A Casa di Mà",
    location: "Lumio",
    description: "A four-star hotel overlooking the Gulf of Calvi, with a pool, restaurant and views across the Balagne landscape.",
    href: "https://www.acasadima.com/en/",
    image: "/assets/stays/a-casa-di-ma.jpg",
  },
] as const;

export default function InformationPage() {
  return (
    <FigmaPageShell className="information-page">
      <section className="inner-content">
        <h1 className="type-h1">The Programme</h1>
        <div className="information-programme">
          {programme.map(([date, title, copy, place, image]) => (
            <ScrollReveal key={title}>
              <article className="information-event">
                <p className="figma-event-date">{date}</p>
                <h2 className="type-h2 information-event__title">{title}</h2>
                <p className="type-body">{copy}</p>
                <span aria-hidden="true">📍</span>
                <address>{place}</address>
                <div><Image src={image} alt={`${title} in Corsica`} fill sizes="(max-width: 760px) 90vw, 64vw" /></div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <section className="stay-section">
            <h2 className="type-h2">Where to Stay</h2>
            <p className="type-body type-intro">Lumio, Calvi and L’Île-Rousse are all wonderful bases for the weekend. Here are a few places to start your search.</p>
            <div className="stay-list">
              {stays.map((stay) => (
                <article key={stay.name}>
                  <div className="stay-photo"><Image src={stay.image} alt={`${stay.name} in ${stay.location}`} fill sizes="(max-width: 760px) 90vw, 35vw" /></div>
                  <div>
                    <p className="stay-location">{stay.location}</p>
                    <h3 className="type-h3">{stay.name}</h3>
                    <p className="type-body">{stay.description}</p>
                    <a href={stay.href} target="_blank" rel="noreferrer">Visit website ↗</a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="information-copy">
            <h2 className="type-h2">Transport</h2>
            <h3 className="type-h3">By Flight</h3>
            <p className="type-body">
              The closest airports are Calvi or Bastia. There are plenty of direct options if you travel from France; however, there are fewer options from London, so you might need to get a transfer. If you are travelling from Italy, we recommend travelling by car and ferry—info below!
            </p>
            <h3 className="type-h3">By Ferry</h3>
            <p className="type-body">
              For people coming from Italy, we recommend the ferry, either from Genoa or Livorno. You can drive your car onto the ferry, which would save you from renting a car in Corsica.
            </p>
            <h3 className="type-h3">Hiring a Car</h3>
            <p className="type-body">
              We recommend hiring one. It gives you freedom between the airport, coast and villages; plans for transport around the main celebration will follow with the final schedule. You can find plenty of options on Get Around or Turo!
            </p>
            <h3 className="type-h3">The Day of the Wedding</h3>
            <p className="type-body">
              There is public parking just outside the venue, and we are organising a shuttle that will bring you back to your accommodation from 2am until the end! If you are staying further away than our recommended locations and want to use the shuttle service for the return, let us know.
            </p>
          </section>
        </ScrollReveal>
        <ScrollReveal><section className="theme-block"><h2 className="type-h2">Dress Code</h2><p className="type-body type-intro">Summer formal with Mediterranean colour—elegant, joyful and comfortable enough to dance until sunrise.</p></section></ScrollReveal>
      </section>
    </FigmaPageShell>
  );
}
