"use client";

import { useEffect, useRef } from "react";

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const youtubeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const controlYouTube = (command: "playVideo" | "pauseVideo") => {
      youtubeRef.current?.contentWindow?.postMessage(JSON.stringify({
        event: "command",
        func: command,
        args: [],
      }), "https://www.youtube-nocookie.com");
    };

    const updateProgress = () => {
      animationFrame = 0;
      const bounds = section.getBoundingClientRect();
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));
      section.style.setProperty("--hero-progress", progress.toFixed(4));
      section.dataset.scene = progress < 0.46 ? "opening" : "rocher";
    };

    const queueProgressUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateProgress);
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (reducedMotion.matches || !entry.isIntersecting) {
        video.pause();
        controlYouTube("pauseVideo");
      } else {
        void video.play().catch(() => undefined);
        controlYouTube("playVideo");
      }
    }, { threshold: 0.05 });

    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        video.pause();
        controlYouTube("pauseVideo");
      } else if (section.getBoundingClientRect().bottom > 0) {
        void video.play().catch(() => undefined);
        controlYouTube("playVideo");
      }
    };

    video.playbackRate = 0.82;
    visibilityObserver.observe(section);
    window.addEventListener("scroll", queueProgressUpdate, { passive: true });
    window.addEventListener("resize", queueProgressUpdate);
    reducedMotion.addEventListener("change", handleMotionPreference);
    updateProgress();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      visibilityObserver.disconnect();
      window.removeEventListener("scroll", queueProgressUpdate);
      window.removeEventListener("resize", queueProgressUpdate);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return (
    <section className="cinematic-hero" id="home" ref={sectionRef}>
      <div className="cinematic-hero__stage">
        <div className="cinematic-hero__film">
          {/* The still remains visible while video loads and for reduced motion. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="cinematic-hero__poster"
            src="/assets/le-rocher-tablescape-editorial.png"
            alt="A long wedding table beneath an olive tree, facing a granite rock and the Corsican sea"
          />
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/le-rocher-tablescape-editorial.png"
            aria-hidden="true"
            onCanPlay={(event) => {
              event.currentTarget.parentElement?.setAttribute("data-video-ready", "true");
            }}
          >
            <source src="/assets/jane-luca-cinematic-reel.mp4" type="video/mp4" />
          </video>
          <iframe
            ref={youtubeRef}
            className="cinematic-hero__youtube"
            src="https://www.youtube-nocookie.com/embed/lvukW3m28qA?autoplay=1&mute=1&controls=0&disablekb=1&enablejsapi=1&end=30&fs=0&iv_load_policy=3&loop=1&modestbranding=1&playlist=lvukW3m28qA&playsinline=1&rel=0&start=5"
            title="Cinematic aerial landscape background"
            allow="autoplay; encrypted-media; picture-in-picture"
            loading="eager"
            tabIndex={-1}
            aria-hidden="true"
            onLoad={(event) => {
              event.currentTarget.parentElement?.setAttribute("data-youtube-ready", "true");
            }}
          />
          <div className="cinematic-hero__grade" aria-hidden="true" />
        </div>

        <div className="cinematic-hero__scene cinematic-hero__scene--opening">
          <p>A weekend in the Balagne</p>
          <h1>Jane <i>&amp;</i> Luca</h1>
        </div>

        <div className="cinematic-hero__scene cinematic-hero__scene--rocher" aria-hidden="true">
          <p>Scene two · the island</p>
          <h2>Meet us<br />by <i>the rock.</i></h2>
          <span className="cinematic-hero__aside">Three days by the sea / one very good reason to come</span>
        </div>

        <div className="cinematic-hero__progress" aria-hidden="true">
          <span>J&amp;L / Corsica</span>
          <i><b /></i>
          <span>Scroll to enter</span>
        </div>
      </div>
    </section>
  );
}
