"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { SmartVideo } from "./SmartVideo";

/**
 * Cinematic video band: the frame grows into place as it scrolls into view,
 * with a dark gradient, title overlay and a play/pause button with progress.
 */
export function VideoFeature({
  src,
  eyebrow,
  title,
  text,
  labels,
}: {
  src: string;
  eyebrow: string;
  title: string;
  text: string;
  labels: { play: string; pause: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [64, 28]);
  const textY = useTransform(scrollYProgress, [0.4, 1], [40, 0]);
  const textOpacity = useTransform(scrollYProgress, [0.45, 1], [0, 1]);

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 py-20 sm:py-28">
      <div className="grid-lines absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div className="absolute top-1/3 left-1/2 -z-10 size-[700px] -translate-x-1/2 rounded-full bg-navy-500/20 blur-[140px]" aria-hidden />

      <div ref={ref} className="container-x">
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="relative aspect-[4/5] overflow-hidden bg-navy-900 shadow-[0_40px_100px_rgb(0_0_0/0.45)] ring-1 ring-white/10 sm:aspect-video"
        >
          <SmartVideo src={src} toggle labels={labels} className="absolute inset-0 size-full object-cover" />

          {/* Cinematic grading: dark edges and a strong base for the text */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/25 to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-950/60 via-transparent to-transparent rtl:bg-gradient-to-l" aria-hidden />
          <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgb(7_19_34/0.55)]" aria-hidden />

          <motion.div style={{ y: textY, opacity: textOpacity }} className="absolute inset-x-6 bottom-24 text-white sm:inset-x-12 sm:bottom-12 sm:max-w-xl">
            <p className="eyebrow text-sky">{eyebrow}</p>
            <h2 className="mt-4 text-3xl leading-tight font-extrabold sm:text-5xl rtl:leading-[1.35]">{title}</h2>
            <p className="mt-4 text-base leading-7 text-white/75 sm:text-lg sm:leading-8">{text}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
