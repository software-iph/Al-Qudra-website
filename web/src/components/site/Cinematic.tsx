"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { EASE } from "./Motion";

/*
 * Cinematic scroll pieces for the ALQUDRA home page. Every effect is tied to the
 * visitor's own scrolling (nothing moves by itself), so the pages stay calm when
 * nobody scrolls. Sticky positioning does the pinning; motion/react maps scroll
 * progress to transforms (GPU-friendly: transform, opacity, clip-path only).
 */

/**
 * Full-screen hero that stays pinned while the film pulls back into a framed
 * shot (the paper page appears around it) and the headline lifts away.
 */
export function CinematicHero({ media, children, overlay }: { media: ReactNode; children: ReactNode; overlay?: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(0% 0% 0% 0%)", "inset(9% 5% 9% 5%)"]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const textY = useTransform(scrollYProgress, [0, 0.7], ["0%", "-35%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section ref={ref} className="relative h-[175svh] bg-paper">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0 overflow-hidden bg-navy-900" style={{ clipPath: clip }}>
          <motion.div className="absolute inset-0" style={{ scale: zoom }}>
            {media}
          </motion.div>
          {overlay}
        </motion.div>
        <motion.div className="relative flex h-full items-end pb-14 text-paper" style={{ y: textY, opacity: textOpacity }}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

/** A statement whose words light up one by one as it scrolls through the screen. */
export function ScrollWords({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Word key={`${w}-${i}`} progress={scrollYProgress} from={i / words.length} to={(i + 1) / words.length}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, from, to }: { children: string; progress: MotionValue<number>; from: number; to: number }) {
  const opacity = useTransform(progress, [from, to], [0.14, 1]);
  return (
    <>
      <motion.span style={{ opacity }} aria-hidden>
        {children}
      </motion.span>{" "}
    </>
  );
}

/** Photo that drifts against the scroll (depth). `speed` = % of its height travelled. */
export function ParallaxPhoto({ src, className = "", speed = 12 }: { src: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed}%`, `${speed}%`]);
  return (
    <div ref={ref} className={`relative overflow-hidden bg-limestone ${className}`}>
      <motion.div className="absolute inset-x-0 -top-[15%] h-[130%]" style={{ y }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="photo size-full object-cover" />
      </motion.div>
    </div>
  );
}

export type Reel = { id: number; title: string; image: string; href: string };

/**
 * Pinned reel: while the visitor scrolls down, the services slide sideways
 * past the screen (right-to-left in English, left-to-right in Arabic).
 */
export function ServicesReel({ items, intro, rtl }: { items: Reel[]; intro: ReactNode; rtl: boolean }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [viewH, setViewH] = useState(0);

  // How far the track must travel = its width minus the screen width (measured, kept in sync on resize).
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
      setViewH(window.innerHeight);
    });
    ro.observe(el);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.04, 0.96], [0, rtl ? distance : -distance]);
  const bar = useTransform(scrollYProgress, [0.04, 0.96], [0, 1]);

  return (
    <section ref={section} className="relative bg-navy-900 text-paper" style={{ height: distance ? distance + viewH : "100svh" }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.div ref={track} className="flex w-max items-center gap-6 px-5 sm:gap-8 sm:px-10 xl:px-[4.5rem]" style={{ x }}>
          <div className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[34vw]">{intro}</div>
          {items.map((s, i) => (
            <Link
              key={s.id}
              href={s.href}
              className="group relative block aspect-[4/5] w-[78vw] shrink-0 overflow-hidden bg-navy-800 sm:aspect-[4/3] sm:w-[62vw] lg:w-[46vw]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt="" className="photo absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-settle group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/10 to-transparent" aria-hidden />
              <span className="label-mono absolute start-6 top-6 text-paper/80" dir="ltr">
                {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <h3 className="absolute inset-x-6 bottom-6 text-2xl font-extrabold text-balance sm:text-4xl" style={{ fontStretch: "112%" }}>
                {s.title}
              </h3>
            </Link>
          ))}
          <div className="w-[8vw] shrink-0" aria-hidden />
        </motion.div>
        <div className="container-x mt-10">
          <div className="h-px w-full bg-paper/15">
            <motion.div className="h-px origin-left bg-copper rtl:origin-right" style={{ scaleX: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export type Pillar = { id: number; title: string; body: string };

/** Q³ pillars as full-width panels that stack over each other while scrolling. */
export function StackedPillars({ items, heading }: { items: Pillar[]; heading: ReactNode }) {
  const tones = ["bg-navy-900 text-paper", "bg-navy-700 text-paper", "bg-limestone text-ink"];
  return (
    <section className="relative bg-paper py-24 sm:py-32">
      <div className="container-x mb-14">{heading}</div>
      <div className="container-x">
        {items.map((p, i) => (
          <div key={p.id} className="sticky" style={{ top: `calc(6rem + ${i * 1.75}rem)` }}>
            <motion.article
              className={`relative mb-8 flex min-h-[62svh] flex-col justify-between overflow-hidden p-8 sm:p-14 ${tones[i % tones.length]}`}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <span
                className="pointer-events-none absolute -end-6 -bottom-16 text-[14rem] leading-none font-black opacity-[0.08] select-none sm:text-[22rem]"
                style={{ fontStretch: "125%" }}
                dir="ltr"
                aria-hidden
              >
                Q<sup>{i + 1}</sup>
              </span>
              <span className="label-mono opacity-70" dir="ltr">
                Q{i + 1} / Q³
              </span>
              <div className="relative max-w-2xl">
                <h3 className="text-5xl font-black sm:text-7xl" style={{ fontStretch: "118%" }}>
                  {p.title}
                </h3>
                <p className="mt-6 max-w-xl text-lg leading-8 opacity-80">{p.body}</p>
              </div>
            </motion.article>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Closing scene: a photo opens out of the Q ring as the visitor scrolls,
 * until it fills the screen and the call to action appears.
 */
export function RingReveal({ src, children }: { src: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const clip = useTransform(scrollYProgress, [0, 0.7], ["circle(14% at 50% 50%)", "circle(75% at 50% 50%)"]);
  const ring = useTransform(scrollYProgress, [0, 0.7], [1, 5.4]);
  const ringOpacity = useTransform(scrollYProgress, [0.45, 0.7], [1, 0]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.6, 0.85], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.6, 0.85], [24, 0]);

  return (
    <section ref={ref} className="relative h-[220svh] bg-paper">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0 bg-navy-900" style={{ clipPath: clip }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img src={src} alt="" className="photo absolute inset-0 size-full object-cover opacity-70" style={{ scale: zoom }} />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/50 to-navy-900/20" aria-hidden />
        </motion.div>
        {/* The Q ring the photo opens out of */}
        <motion.svg
          viewBox="0 0 100 100"
          className="pointer-events-none absolute top-1/2 left-1/2 size-[30vmin] -translate-x-1/2 -translate-y-1/2 text-ink"
          style={{ scale: ring, opacity: ringOpacity }}
          aria-hidden
        >
          <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </motion.svg>
        <motion.div className="relative flex h-full items-end pb-20 text-paper" style={{ opacity: textOpacity, y: textY }}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

/** Inner-page header photo: slowly zooms and sinks as the visitor scrolls away from the top. */
export function HeaderPhoto({ src }: { src: string }) {
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 700], [1, 1.18]);
  const y = useTransform(scrollY, [0, 700], [0, 140]);
  return (
    <motion.div className="absolute inset-0 -z-20" style={{ scale, y }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="photo size-full object-cover opacity-60" />
    </motion.div>
  );
}
