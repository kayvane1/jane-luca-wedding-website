import Image from "next/image";

import { FigmaPageShell } from "@/components/figma-page-shell";
import { ScrollReveal } from "@/components/scroll-reveal";

const storyImages = Array.from(
  { length: 8 },
  (_, index) => `/assets/figma-story/display-${index + 1}.jpeg`,
);

export default function StoryPage() {
  return (
    <FigmaPageShell className="story-page">
      <section className="story-page__content">
        <ScrollReveal>
          <h1>Our Story</h1>
          <p>Our story began at a time when we were both building something of our own.</p>
          <p>
            Jane had just launched her fashion business, Ipseity, and was busy
            organising pop-up shops, photoshoots and events. At the same time,
            Luca was starting Yellow Cactus, his equipment rental business for
            shoots, events and productions.
          </p>
          <p>
            While planning one of her events, Jane found herself searching for
            what she described as “a box where you plug in all the cables for the
            speakers.” As luck would have it, Luca knew exactly what she meant
            and, more importantly, he had a mixer.
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="story-grid">
            {storyImages.map((src, index) => (
              <div key={src}>
                <Image
                  src={src}
                  alt={`A moment from Jane and Luca’s story ${index + 1}`}
                  fill
                  sizes="(max-width: 760px) 46vw, 30vw"
                />
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="story-page__ending">
            <p>
              Seven years later, that mixer is far from the only thing we’ve
              shared. These years have been packed with emotion and a
              never-ending whirlwind of experiences, each one tying us closer
              together. We’ve driven through the night from Oxfordshire to
              London during a storm, with trees threatening to fall around us;
              survived a Latin American work tour that felt like an episode of
              The Traitors; created our first audiovisual collaboration for Soho
              House; and endured the eight-month process of buying our
              almost-derelict, fire-damaged flat in London; to name a few.
            </p>
            <h2>
              And that’s only seven years.
              <br />
              Can you imagine what still awaits us?
            </h2>
          </div>
        </ScrollReveal>
      </section>
    </FigmaPageShell>
  );
}
