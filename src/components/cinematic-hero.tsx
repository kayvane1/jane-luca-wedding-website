"use client";

import { useEffect, useRef, useState } from "react";

const LUMIO_CLIP = "/assets/lumio-drone-6-30.mp4";

export function CinematicHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const invitationRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLElement>(null);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const video = videoRef.current;
    const light = lightRef.current;
    const opening = openingRef.current;
    const invitation = invitationRef.current;
    const date = dateRef.current;
    const progressIndicator = progressRef.current;
    const progressBar = progressBarRef.current;

    if (
      !section
      || !stage
      || !video
      || !light
      || !opening
      || !invitation
      || !date
      || !progressIndicator
      || !progressBar
    ) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopHero = window.matchMedia("(min-width: 821px)");
    let animationFrame = 0;
    let playbackFailureTimer = 0;

    const markVideoPlaying = () => {
      window.clearTimeout(playbackFailureTimer);
      video.parentElement?.setAttribute("data-video-playing", "true");
      setPlaybackBlocked(false);
    };

    const startVideo = () => {
      video.muted = true;
      video.defaultMuted = true;
      const playback = video.play();
      if (playback) {
        void playback
          .then(markVideoPlaying)
          .catch(() => {
            window.clearTimeout(playbackFailureTimer);
            playbackFailureTimer = window.setTimeout(() => {
              if (
                video.paused
                && section.getBoundingClientRect().bottom > 0
              ) {
                setPlaybackBlocked(true);
              }
            }, 500);
          });
      }
    };

    const clamp = (value: number) => Math.min(1, Math.max(0, value));
    const mapProgress = (progress: number, start: number, end: number) => (
      clamp((progress - start) / (end - start))
    );

    const updateProgress = () => {
      animationFrame = 0;
      const bounds = section.getBoundingClientRect();
      // `innerHeight` changes as mobile browser chrome collapses. The sticky
      // stage uses `svh`, so measure against that stable element instead.
      const travel = Math.max(section.offsetHeight - stage.offsetHeight, 1);
      const progress = clamp(-bounds.top / travel);
      const isDesktop = desktopHero.matches;
      const reduceMovement = reducedMotion.matches;
      const openingExit = isDesktop
        ? mapProgress(progress, 0.08, 0.36)
        : mapProgress(progress, 0.14, 0.29);
      const invitationEnter = isDesktop
        ? mapProgress(progress, 0.24, 0.52)
        : mapProgress(progress, 0.25, 0.4);
      const invitationExit = isDesktop ? 0 : mapProgress(progress, 0.94, 1);
      const dateEnter = isDesktop
        ? invitationEnter
        : mapProgress(progress, 0.56, 0.69);
      const dateExit = isDesktop ? 0 : mapProgress(progress, 0.94, 1);
      const invitationEase = 1 - Math.pow(1 - invitationEnter, 3);
      const dateEase = 1 - Math.pow(1 - dateEnter, 3);
      const promptExit = mapProgress(progress, 0.84, 1);

      opening.style.opacity = (1 - openingExit).toFixed(4);
      opening.style.transform = reduceMovement
        ? "none"
        : `translate3d(0, ${(-3.5 * openingExit).toFixed(3)}rem, 0)`;
      invitation.style.opacity = (invitationEnter * (1 - invitationExit)).toFixed(4);
      invitation.style.transform = reduceMovement
        ? "none"
        : `translate3d(0, ${((1 - invitationEase) * 3.5).toFixed(3)}rem, 0)`;
      date.style.opacity = (dateEnter * (1 - dateExit)).toFixed(4);
      date.style.transform = reduceMovement
        ? "none"
        : `translate3d(0, ${((1 - dateEase) * 2.25).toFixed(3)}rem, 0)`;
      light.style.transform = reduceMovement
        ? "translate3d(-21vw, 0, 0)"
        : `translate3d(${((progress - 0.5) * 42).toFixed(3)}vw, 0, 0)`;
      progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;
      progressIndicator.style.opacity = (1 - promptExit).toFixed(4);

      if (desktopHero.matches && !reduceMovement) {
        video.style.transform = `scale(${(1.015 + progress * 0.07).toFixed(4)})`;
      } else {
        video.style.transform = "none";
      }
    };

    const queueProgressUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateProgress);
    };

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
      } else {
        startVideo();
      }
    }, { threshold: 0.05 });

    const handleMotionPreference = () => {
      if (section.getBoundingClientRect().bottom > 0) {
        startVideo();
      }
      queueProgressUpdate();
    };

    const handleFirstGesture = () => {
      if (
        video.paused
        && section.getBoundingClientRect().bottom > 0
      ) {
        startVideo();
      }
    };

    const handleCanPlay = () => {
      const bounds = section.getBoundingClientRect();
      if (
        bounds.bottom > 0
        && bounds.top < window.innerHeight
      ) {
        startVideo();
      }
    };

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    visibilityObserver.observe(section);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("playing", markVideoPlaying);
    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("scroll", queueProgressUpdate, { passive: true });
    window.addEventListener("resize", queueProgressUpdate);
    desktopHero.addEventListener("change", queueProgressUpdate);
    reducedMotion.addEventListener("change", handleMotionPreference);
    updateProgress();
    startVideo();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(playbackFailureTimer);
      visibilityObserver.disconnect();
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("playing", markVideoPlaying);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("scroll", queueProgressUpdate);
      window.removeEventListener("resize", queueProgressUpdate);
      desktopHero.removeEventListener("change", queueProgressUpdate);
      reducedMotion.removeEventListener("change", handleMotionPreference);
    };
  }, []);

  return (
    <section className="cinematic-hero" id="home" ref={sectionRef}>
      <div className="cinematic-hero__stage" ref={stageRef}>
        <div className="cinematic-hero__film" aria-hidden="true">
          <video
            ref={videoRef}
            className="cinematic-hero__video"
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            disablePictureInPicture
            preload="auto"
            tabIndex={-1}
          >
            <source src={LUMIO_CLIP} type="video/mp4" />
          </video>
          <div className="cinematic-hero__poster" />
          <div className="cinematic-hero__grade" />
          <div className="cinematic-hero__light" ref={lightRef} />
        </div>

        <div
          className="cinematic-hero__scene cinematic-hero__scene--opening"
          ref={openingRef}
        >
          <h1>Jane <i>&amp;</i> Luca</h1>
        </div>

        <div
          className="cinematic-hero__scene cinematic-hero__scene--invitation"
          ref={invitationRef}
        >
          <h2>Come celebrate<br /><i>with us in Corsica</i></h2>
        </div>

        <div
          className="cinematic-hero__scene cinematic-hero__scene--date"
          ref={dateRef}
        >
          <p className="cinematic-hero__date">10 July 2027</p>
        </div>

        {playbackBlocked && (
          <button
            className="cinematic-hero__play"
            type="button"
            onClick={() => {
              const video = videoRef.current;
              if (!video) return;
              video.muted = true;
              video.defaultMuted = true;
              void video.play()
                .then(() => setPlaybackBlocked(false))
                .catch(() => setPlaybackBlocked(true));
            }}
          >
            Play film
          </button>
        )}

        <div className="cinematic-hero__progress" aria-hidden="true" ref={progressRef}>
          <i><b ref={progressBarRef} /></i>
          <span>Scroll to enter</span>
        </div>
      </div>
    </section>
  );
}
