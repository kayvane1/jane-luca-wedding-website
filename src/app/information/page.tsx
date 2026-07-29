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
        <h1>The Programme</h1>
        <div className="information-programme">
          {programme.map(([date, title, copy, place, image]) => (
            <ScrollReveal key={title}>
              <article className="information-event">
                <p className="figma-event-date">{date}</p>
                <h2>{title}</h2>
                <p>{copy}</p>
                <span aria-hidden="true">📍</span>
                <address>{place}</address>
                <div><Image src={image} alt={`${title} in Corsica`} fill sizes="(max-width: 760px) 90vw, 64vw" /></div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <section className="stay-section">
            <h2>Where to Stay</h2>
            <p>Lumio, Calvi and L’Île-Rousse all make good bases for the weekend. Here are a few practical starting points.</p>
            <div className="stay-list">
              {stays.map((stay) => (
                <article key={stay.name}>
                  <div className="stay-photo"><Image src={stay.image} alt={`${stay.name} in ${stay.location}`} fill sizes="(max-width: 760px) 90vw, 35vw" /></div>
                  <div>
                    <p className="stay-location">{stay.location}</p>
                    <h3>{stay.name}</h3>
                    <p>{stay.description}</p>
                    <a href={stay.href} target="_blank" rel="noreferrer">Visit website ↗</a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal><section className="information-copy"><h2>Transport</h2><h3>By Flight</h3><p>The closest airports are Calvi and Bastia. Direct services vary by season, so compare both before booking.</p><h3>By Ferry</h3><p>From Italy, ferries from Genoa or Livorno let you bring a car and arrive ready to explore.</p><h3>Hiring a car</h3><p>We recommend hiring one for freedom between the airport, coast and villages. Wedding-night return shuttles are planned.</p><h3>The Day of the Wedding</h3><p>Public parking is available near the venue. Final shuttle information will follow with the schedule.</p></section></ScrollReveal>
        <ScrollReveal><section className="theme-block"><h2>Theme</h2><p>Summer formal with Mediterranean colour: elegant, joyful, and comfortable enough to dance until sunrise.</p></section></ScrollReveal>
      </section>
    </FigmaPageShell>
  );
}
