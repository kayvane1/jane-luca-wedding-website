"use client";

import { useEffect, useRef } from "react";

const LUMIO_VIDEO_ID = "lvukW3m28qA";
const SEGMENT_START = 6;
const SEGMENT_END = 30;

interface YouTubePlayer {
  cueVideoById(options: { videoId: string; startSeconds: number; endSeconds: number }): void;
  destroy(): void;
  getCurrentTime(): number;
  getPlayerState(): number;
  loadVideoById(options: { videoId: string; startSeconds: number; endSeconds: number }): void;
  mute(): void;
  pauseVideo(): void;
  playVideo(): void;
}

interface YouTubeApi {
  Player: new (element: HTMLElement, options: {
    host: string;
    videoId: string;
    playerVars: Record<string, number | string>;
    events: {
      onReady: (event: { target: YouTubePlayer }) => void;
      onStateChange: (event: { data: number; target: YouTubePlayer }) => void;
    };
  }) => YouTubePlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
  };
}

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeApi> | null = null;

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise<YouTubeApi>((resolve, reject) => {
    const previousReadyHandler = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();
      if (window.YT) resolve(window.YT);
    };

    if (document.getElementById("youtube-iframe-api")) return;

    const script = document.createElement("script");
    script.id = "youtube-iframe-api";
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("Unable to load the YouTube player API"));
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const playerHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const playerHost = playerHostRef.current;

    if (!section || !playerHost) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let loopTimer = 0;
    let player: YouTubePlayer | null = null;
    let playerApi: YouTubeApi | null = null;
    let disposed = false;
    let heroVisible = section.getBoundingClientRect().bottom > 0;
    let segmentLoops = 0;

    section.dataset.segmentLoops = "0";

    const loadSegment = (shouldPlay = true) => {
      if (!player) return;

      const options = {
        videoId: LUMIO_VIDEO_ID,
        startSeconds: SEGMENT_START,
        endSeconds: SEGMENT_END,
      };

      if (shouldPlay && heroVisible && !reducedMotion.matches) {
        player.loadVideoById(options);
      } else {
        player.cueVideoById(options);
        player.pauseVideo();
      }
    };

    const restartSegment = () => {
      segmentLoops += 1;
      section.dataset.segmentLoops = String(segmentLoops);
      loadSegment();
    };

    const enforceSegment = () => {
      if (!player || !playerApi || reducedMotion.matches || !heroVisible) return;
      if (player.getPlayerState() !== playerApi.PlayerState.PLAYING) return;

      const currentTime = player.getCurrentTime();
      section.dataset.videoTime = currentTime.toFixed(2);
      if (
        (currentTime > 0.5 && currentTime < SEGMENT_START - 0.2)
        || currentTime >= SEGMENT_END - 0.75
      ) {
        restartSegment();
      }
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
      heroVisible = entry.isIntersecting;

      if (!player) return;
      if (reducedMotion.matches || !heroVisible) {
        player.pauseVideo();
      } else {
        const currentTime = player.getCurrentTime();
        if (currentTime < SEGMENT_START - 0.2 || currentTime >= SEGMENT_END - 0.35) {
          loadSegment();
        } else {
          player.playVideo();
        }
      }
    }, { threshold: 0.05 });

    const handleMotionPreference = () => {
      if (!player) return;
      if (reducedMotion.matches) {
        player.pauseVideo();
      } else if (heroVisible) {
        loadSegment();
      }
    };

    visibilityObserver.observe(section);
    window.addEventListener("scroll", queueProgressUpdate, { passive: true });
    window.addEventListener("resize", queueProgressUpdate);
    reducedMotion.addEventListener("change", handleMotionPreference);
    updateProgress();

    void loadYouTubeApi().then((api) => {
      if (disposed) return;
      playerApi = api;
      player = new api.Player(playerHost, {
        host: "https://www.youtube-nocookie.com",
        videoId: LUMIO_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          end: SEGMENT_END,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          start: SEGMENT_START,
        },
        events: {
          onReady: (event) => {
            player = event.target;
            player.mute();
            loadSegment();
            loopTimer = window.setInterval(enforceSegment, 150);
          },
          onStateChange: (event) => {
            player = event.target;
            if (event.data === api.PlayerState.PLAYING) {
              const currentTime = player.getCurrentTime();
              section.dataset.videoTime = currentTime.toFixed(2);
              if (currentTime < SEGMENT_START - 0.2 || currentTime >= SEGMENT_END - 0.75) {
                restartSegment();
                return;
              }
              section.querySelector(".cinematic-hero__film")?.setAttribute("data-youtube-ready", "true");
              enforceSegment();
            } else if (event.data === api.PlayerState.ENDED) {
              restartSegment();
            }
          },
        },
      });
    }).catch(() => {
      // The solid navy field remains a deliberate fallback if YouTube is unavailable.
    });

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      window.clearInterval(loopTimer);
      visibilityObserver.disconnect();
      window.removeEventListener("scroll", queueProgressUpdate);
      window.removeEventListener("resize", queueProgressUpdate);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      player?.destroy();
    };
  }, []);

  return (
    <section className="cinematic-hero" id="home" ref={sectionRef}>
      <div className="cinematic-hero__stage">
        <div className="cinematic-hero__film" aria-hidden="true">
          <div className="cinematic-hero__youtube">
            <div ref={playerHostRef} />
          </div>
          <div className="cinematic-hero__grade" />
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
