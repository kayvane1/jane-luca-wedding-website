"use client";

import { useEffect, useRef } from "react";

const LUMIO_CLIP = "/assets/lumio-drone-6-30.mp4";

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const markVideoReady = () => {
      video.parentElement?.setAttribute("data-video-ready", "true");
    };

    const updateProgress = () => {
      animationFrame = 0;
      const bounds = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));
      section.style.setProperty("--hero-progress", progress.toFixed(4));
    };

    const queueProgressUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateProgress);
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (reducedMotion.matches || !entry.isIntersecting) {
        video.pause();
      } else {
        void video.play().catch(() => undefined);
      }
    }, { threshold: 0.05 });

    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        video.pause();
      } else if (section.getBoundingClientRect().bottom > 0) {
        void video.play().catch(() => undefined);
      }
    };

    visibilityObserver.observe(section);
    video.addEventListener("loadeddata", markVideoReady);
    window.addEventListener("scroll", queueProgressUpdate, { passive: true });
    window.addEventListener("resize", queueProgressUpdate);
    reducedMotion.addEventListener("change", handleMotionPreference);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) markVideoReady();
    updateProgress();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      visibilityObserver.disconnect();
      video.removeEventListener("loadeddata", markVideoReady);
      window.removeEventListener("scroll", queueProgressUpdate);
      window.removeEventListener("resize", queueProgressUpdate);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return (
    <section className="cinematic-hero" id="home" ref={sectionRef}>
      <div className="cinematic-hero__stage">
        <div className="cinematic-hero__film" aria-hidden="true">
          <video
            ref={videoRef}
            className="cinematic-hero__video"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            tabIndex={-1}
            onLoadedData={(event) => {
              event.currentTarget.parentElement?.setAttribute("data-video-ready", "true");
            }}
          >
            <source src={LUMIO_CLIP} type="video/mp4" />
          </video>
          <div className="cinematic-hero__grade" />
        </div>

        <div className="cinematic-hero__scene cinematic-hero__scene--opening">
          <h1>Jane <i>&amp;</i> Luca</h1>
        </div>

        <div className="cinematic-hero__scene cinematic-hero__scene--invitation">
          <h2>Come celebrate<br /><i>with us in Corsica</i></h2>
          <p className="cinematic-hero__date">10 July 2027</p>
        </div>

        <div className="cinematic-hero__progress" aria-hidden="true">
          <i><b /></i>
          <span>Scroll to enter</span>
        </div>
      </div>
    </section>
  );
}
