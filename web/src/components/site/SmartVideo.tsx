"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Optimised versions of the bundled videos (re-encoded with fast start, no audio).
 * Videos uploaded from the dashboard are played as uploaded.
 */
const VARIANTS: Record<string, { webm?: string; mobile?: string; poster?: string }> = {
  "/videos/hero.mp4": { webm: "/videos/hero.webm", mobile: "/videos/hero-720.mp4", poster: "/images/hero-poster.webp" },
  "/videos/office.mp4": { mobile: "/videos/office-720.mp4", poster: "/images/office-poster.webp" },
};

/**
 * Muted background video that
 *  - only downloads once it is near the screen (the hero loads immediately),
 *  - picks WebM where supported and the 720p file on phones,
 *  - pauses while off screen (smoother scrolling, less CPU),
 * With `toggle`, a round play/pause button with a progress ring is shown
 * (the parent must be `relative`).
 */
export function SmartVideo({
  src,
  poster,
  className,
  eager = false,
  toggle = false,
  labels = { play: "Play video", pause: "Pause video" },
}: {
  src: string;
  poster?: string;
  className?: string;
  eager?: boolean;
  toggle?: boolean;
  labels?: { play: string; pause: string };
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const ring = useRef<SVGCircleElement>(null);
  const userPaused = useRef(false);
  const [source, setSource] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const variant = VARIANTS[src];
  const posterSrc = poster || variant?.poster;

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return;
    // Always autoplays (muted, looping) - also when Windows "animation effects" are off.

    const pick = () => {
      const small = window.matchMedia("(max-width: 767px)").matches;
      if (small && variant?.mobile) return variant.mobile;
      if (variant?.webm && video.canPlayType('video/webm; codecs="vp9"')) return variant.webm;
      return src;
    };

    // Eager (hero) videos already have their files in the HTML and start natively;
    // here we only make sure playback starts and pause them while off screen.
    if (eager) void video.play().catch(() => undefined);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!eager) setSource((current) => current ?? pick());
          if (!userPaused.current) void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { rootMargin: eager ? "0px" : "300px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src, variant, eager]);

  // Progress ring follows playback without re-rendering.
  useEffect(() => {
    const video = ref.current;
    if (!toggle || !video) return;
    let frame = 0;
    const tick = () => {
      if (ring.current && video.duration) {
        ring.current.style.strokeDashoffset = String(100 - (video.currentTime / video.duration) * 100);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [toggle]);

  const flip = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      if (!source) setSource(src);
      void video.play().catch(() => undefined);
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  const element = (
    <video
      ref={ref}
      className={className}
      src={eager ? undefined : (source ?? undefined)}
      poster={posterSrc}
      muted
      loop
      playsInline
      autoPlay
      preload={eager ? "auto" : "none"}
      aria-hidden
      disablePictureInPicture
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
    >
      {/* Hero: files are in the HTML so the browser starts playing before any script runs.
          The browser takes the first source it can use: 720p on phones, then WebM, then MP4. */}
      {eager && variant?.mobile && <source src={variant.mobile} type="video/mp4" media="(max-width: 767px)" />}
      {eager && variant?.webm && <source src={variant.webm} type="video/webm" />}
      {eager && <source src={src} type={src.endsWith(".webm") ? "video/webm" : "video/mp4"} />}
    </video>
  );

  if (!toggle) return element;

  return (
    <>
      {element}
      <button
        type="button"
        onClick={flip}
        aria-label={playing ? labels.pause : labels.play}
        className="group absolute end-5 bottom-5 z-10 flex size-14 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition hover:scale-105 hover:bg-white/25 sm:end-8 sm:bottom-8 sm:size-16"
      >
        <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
          <circle cx="18" cy="18" r="16" fill="none" stroke="rgb(255 255 255 / 0.2)" strokeWidth="1.5" />
          <circle ref={ring} cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="1.5" pathLength={100} strokeDasharray="100" strokeDashoffset="100" strokeLinecap="round" />
        </svg>
        {playing ? <Pause className="size-5 fill-current" /> : <Play className="size-5 translate-x-px fill-current" />}
      </button>
    </>
  );
}
