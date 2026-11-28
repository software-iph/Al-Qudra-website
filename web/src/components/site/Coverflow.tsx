"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = { id: number; src: string; caption: string };

/**
 * "Inside ALQUDRA": the original 3D coverflow (restored from commit 8a28824).
 * The active photo sits in front in colour, two photos on each side swing back in 3D and
 * greyscale, over a huge faded title that drifts against the mouse.
 * Arrows on the stage, swipe, keyboard (←/→ when focused), a visible pause button,
 * autoplay only for visitors who allow motion, paused on hover/focus (WCAG 2.2.2).
 *
 * Keep opacity, filter and transform off every ancestor of `.aq-stage`: any of them
 * flattens the 3D scene.
 */
export function Coverflow({
  slides,
  backdrop,
  fallbackCaption,
  rtl,
  labels,
}: {
  slides: Slide[];
  backdrop: string;
  fallbackCaption: string;
  rtl: boolean;
  labels: { prev: string; next: string; pause: string; play: string };
}) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const [stopped, setStopped] = useState(false);
  const touchX = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(true);
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);
  const forward = rtl ? -1 : 1; // in Arabic the next photo comes from the left
  if (count === 0) return null;

  const position = (i: number) => {
    let offset = (i - index + count) % count;
    if (offset > count / 2) offset -= count;
    return offset;
  };
  // Captions are optional (dashboard → Gallery); without one only the counter shows.
  const caption = slides[index].caption;
  const paused = hover || stopped;
  const pad = (n: number) => String(n).padStart(2, "0");
  const arrow =
    "absolute top-1/2 z-20 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-navy-800 text-white transition-colors duration-[160ms] hover:bg-navy-700";

  return (
    <div
      ref={rootRef}
      className="aq-coverflow relative"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        rootRef.current?.style.setProperty("--mx", "0");
        rootRef.current?.style.setProperty("--my", "0");
      }}
      onPointerMove={(e) => {
        // Mouse position as -1..1 for the tilt, shine and backdrop drift (CSS variables, no re-render).
        if (e.pointerType !== "mouse" || !rootRef.current) return;
        const r = rootRef.current.getBoundingClientRect();
        rootRef.current.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        rootRef.current.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      }}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      {/* Huge faded title behind the cards */}
      <p
        aria-hidden
        className="aq-backdrop pointer-events-none absolute inset-x-0 -top-4 overflow-hidden text-center font-display text-[clamp(2.5rem,9vw,9rem)] leading-none font-bold tracking-[-0.04em] whitespace-nowrap uppercase select-none sm:-top-8"
        style={{
          background: "linear-gradient(to bottom, rgb(12 29 43 / 0.16) 25%, rgb(12 29 43 / 0) 80%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {backdrop}
      </p>

      <div
        className="aq-stage relative mx-auto h-[280px] max-w-7xl outline-none sm:h-[420px] xl:h-[460px]"
        role="region"
        aria-roledescription="carousel"
        aria-label={backdrop}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + (rtl ? -1 : 1));
          if (e.key === "ArrowLeft") go(index + (rtl ? 1 : -1));
        }}
        onTouchStart={(e) => (touchX.current = e.changedTouches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const diff = touchX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 50) go(index + (diff > 0 ? 1 : -1) * forward);
          touchX.current = null;
        }}
      >
        <div className="relative size-full [transform-style:preserve-3d]">
          {slides.map((slide, i) => {
            const p = position(i);
            const visible = Math.abs(p) <= 2;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => go(i)}
                tabIndex={visible ? 0 : -1}
                aria-label={slide.caption || `${fallbackCaption} ${i + 1}`}
                aria-current={p === 0}
                className="aq-card absolute top-1/2 left-1/2 overflow-hidden rounded-[4px] bg-limestone"
                data-pos={visible ? p * forward : "hidden"}
              >
                <span className="aq-tilt block size-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.src} alt="" loading="lazy" className="photo size-full object-cover" draggable={false} />
                  <span className="aq-shine" aria-hidden />
                </span>
              </button>
            );
          })}
        </div>

        <button type="button" onClick={() => go(index - 1)} aria-label={labels.prev} className={`${arrow} start-0 sm:start-4`}>
          <ChevronLeft className="flip-rtl size-5" aria-hidden />
        </button>
        <button type="button" onClick={() => go(index + 1)} aria-label={labels.next} className={`${arrow} end-0 sm:end-4`}>
          <ChevronRight className="flip-rtl size-5" aria-hidden />
        </button>
      </div>

      {/* Caption, counter, timer and pause */}
      <div className="mt-12 flex flex-col items-center text-center">
        {caption && (
          <p key={caption} className="aq-caption mb-5 text-xl font-bold text-ink sm:text-2xl" aria-live="polite">
            {caption}
          </p>
        )}
        <div className="flex items-center gap-4">
          <p className="label-mono text-concrete tabular-nums" dir="ltr">
            <span className="text-navy-800">{pad(index + 1)}</span> / {pad(count)}
          </p>
          <span className="relative h-px w-24 overflow-hidden bg-navy-800/15" aria-hidden>
            <span
              key={index}
              className="aq-progress absolute inset-0 bg-navy-800"
              style={{ animationPlayState: paused ? "paused" : "running" }}
              onAnimationEnd={() => {
                if (!reducedRef.current && count > 1) go(index + 1);
              }}
            />
          </span>
          <button
            type="button"
            onClick={() => setStopped((s) => !s)}
            aria-label={stopped ? labels.play : labels.pause}
            aria-pressed={stopped}
            className="flex size-9 items-center justify-center rounded-full border border-navy-800/20 text-navy-800 transition-colors duration-[160ms] hover:bg-navy-800/5"
          >
            {stopped ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
          </button>
        </div>
      </div>
    </div>
  );
}
