"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type Slide = { id: number; src: string; caption: string };

/**
 * 3D "coverflow" carousel: the active photo sits in front in full colour,
 * two photos on each side fan out behind it in greyscale.
 * Arrows, dots, swipe, keyboard (when focused) and gentle autoplay.
 */
export function Coverflow({
  slides,
  backdrop,
  fallbackCaption,
  rtl,
}: {
  slides: Slide[];
  backdrop: string;
  fallbackCaption: string;
  rtl: boolean;
}) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);
  // In Arabic the "next" photo comes from the left.
  const forward = rtl ? -1 : 1;

  // Autoplay is driven by the active dot's fill animation (see onAnimationEnd below),
  // so hovering pauses both together. No autoplay for visitors who turned animations off.
  const reducedRef = useRef(true);
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  if (count === 0) return null;
  const active = slides[index];

  // Position of each card relative to the active one: -2..2, others hidden.
  const position = (i: number) => {
    let offset = (i - index + count) % count;
    if (offset > count / 2) offset -= count;
    return offset;
  };

  const caption = active.caption || fallbackCaption;

  return (
    <div
      className="aq-coverflow relative"
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        rootRef.current?.style.setProperty("--mx", "0");
        rootRef.current?.style.setProperty("--my", "0");
      }}
      onPointerMove={(e) => {
        // Mouse position as -1..1 for the tilt / parallax (CSS variables, no re-render).
        if (e.pointerType !== "mouse" || !rootRef.current) return;
        const r = rootRef.current.getBoundingClientRect();
        rootRef.current.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        rootRef.current.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      }}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* Huge faded title behind the cards (drifts slightly against the mouse) */}
      <p
        aria-hidden
        className="aq-backdrop pointer-events-none absolute inset-x-0 -top-6 text-center text-[clamp(2.25rem,8.5vw,8.5rem)] leading-none font-extrabold whitespace-nowrap uppercase select-none sm:-top-10"
        style={{
          background: "linear-gradient(to bottom, rgb(22 56 83 / 0.28) 30%, rgb(22 56 83 / 0) 78%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {backdrop}
      </p>

      <div
        className="relative mx-auto h-[300px] max-w-6xl outline-none [perspective:1000px] sm:h-[420px]"
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
                className="aq-card absolute top-1/2 left-1/2 overflow-hidden rounded-[22px] bg-white shadow-[0_20px_40px_rgb(7_19_34/0.18)]"
                data-pos={visible ? p * forward : "hidden"}
              >
                <span className="aq-tilt block size-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={slide.src} alt="" className="size-full object-cover" draggable={false} />
                  <span className="aq-shine" aria-hidden />
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous"
          className="absolute start-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy-700/70 text-white backdrop-blur transition hover:scale-110 hover:bg-navy-950 sm:start-5"
        >
          <ChevronLeft className="flip-rtl size-5" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next"
          className="absolute end-2 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy-700/70 text-white backdrop-blur transition hover:scale-110 hover:bg-navy-950 sm:end-5"
        >
          <ChevronRight className="flip-rtl size-5" />
        </button>
      </div>

      {/* Caption of the active photo */}
      <div className="mt-10 text-center" aria-live="polite">
        {/* Re-animates only when the caption text itself changes. */}
        <h3 key={caption} className="aq-caption relative inline-block px-2 text-2xl font-extrabold text-navy-700 sm:text-4xl">
          {caption}
        </h3>
        <p className="mt-3 text-sm font-bold tracking-[0.2em] text-muted tabular-nums sm:text-base" dir="ltr">
          <span className="text-navy-700">{String(index + 1).padStart(2, "0")}</span> / {String(count).padStart(2, "0")}
        </p>
        {/* Thin timer bar: fills until the next photo slides in. */}
        <div className="mx-auto mt-4 h-[3px] w-28 overflow-hidden rounded-full bg-navy-700/15">
          <span
            key={index}
            className="aq-progress block h-full rounded-full bg-navy-700"
            style={{ animationPlayState: paused ? "paused" : "running" }}
            onAnimationEnd={() => {
              if (!reducedRef.current && count > 1) go(index + 1);
            }}
          />
        </div>
      </div>

      {/* Dots stay in place; only the active one changes colour and size (no layout shifts). */}
      <div className="mt-7 flex flex-wrap justify-center gap-2.5 px-6">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => go(i)}
            aria-label={`${fallbackCaption} ${i + 1}`}
            aria-current={i === index}
            className={`size-2.5 rounded-full transition-[transform,background-color] duration-300 ease-out ${
              i === index ? "scale-[1.35] bg-navy-700" : "bg-navy-700/20 hover:bg-navy-700/45"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
