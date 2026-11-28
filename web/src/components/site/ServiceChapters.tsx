"use client";

import { Check } from "lucide-react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, useState } from "react";
import type { ServiceItem } from "@/lib/content";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "What we do" as scroll chapters (idea from SLX Management, Awwwards nominee):
 * on large screens a pinned photo panel crossfades to the service being read, with a
 * "01 / 03" counter and a segmented progress bar that fills as you scroll. Inactive
 * chapters dim. On phones each service simply shows its own photo above the text.
 */
export function ServiceChapters({ services }: { services: ServiceItem[] }) {
  const list = useRef<HTMLOListElement>(null);
  const n = services.length;
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 55%", "end 55%"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(n - 1, Math.max(0, Math.floor(v * n)))));
  if (n === 0) return null;
  const current = services[active];

  return (
    <div className="mt-12 lg:grid lg:grid-cols-12 lg:gap-16">
      {/* Pinned panel (large screens) */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 h-[calc(100svh-10rem)] max-h-[560px] overflow-hidden rounded-md bg-navy-900">
          {services.map((s, i) =>
            s.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={s.id}
                src={s.image}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                className={`photo absolute inset-0 size-full object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.2,0,0,1)] ${i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"}`}
              />
            ) : null,
          )}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(12_29_43/0)_40%,rgb(12_29_43/0.9)_100%)]" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <p className="label-mono text-white/60" dir="ltr">
              <span className="text-white">{pad(active + 1)}</span> / {pad(n)}
            </p>
            <p key={active} className="aq-caption mt-3 text-2xl leading-snug font-bold">
              {current.title}
            </p>
            <div className="mt-6 flex gap-2" aria-hidden>
              {services.map((s, i) => (
                <Segment key={s.id} progress={scrollYProgress} from={i / n} to={(i + 1) / n} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chapters */}
      <ol ref={list} className="lg:col-span-7">
        {services.map((s, i) => (
          <li
            key={s.id}
            id={`service-${s.id}`}
            className={`scroll-mt-28 border-t border-navy-800/15 py-12 transition-opacity duration-500 first:border-t-0 lg:flex lg:min-h-[44svh] lg:flex-col lg:justify-center lg:py-12 ${i === active ? "lg:opacity-100" : "lg:opacity-30"}`}
          >
            {s.image && (
              <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-md bg-limestone lg:hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt="" loading="lazy" className="photo absolute inset-0 size-full object-cover" />
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
            >
              <p className="label-mono text-navy-800/50 tabular-nums" dir="ltr">
                {pad(i + 1)} / {pad(n)}
              </p>
              <h3 className="mt-3 font-display text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.1] font-bold tracking-[-0.02em] text-ink">{s.title}</h3>
              <p className="lead mt-5 max-w-xl">{s.summary}</p>
              {s.points.length > 0 && (
                <ul className="mt-9 grid border-t border-navy-800/15 sm:grid-cols-2 sm:gap-x-8">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 border-b border-navy-800/15 py-3.5 text-[15px] text-ink">
                      <Check className="mt-1 size-4 shrink-0 text-patina-600" strokeWidth={2} aria-hidden />
                      <span className="leading-6">{p}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Segment({ progress, from, to }: { progress: MotionValue<number>; from: number; to: number }) {
  const scaleX = useTransform(progress, [from, to], [0, 1]);
  return (
    <span className="relative h-[2px] flex-1 overflow-hidden bg-white/25">
      <motion.span style={{ scaleX }} className="absolute inset-0 origin-left bg-white rtl:origin-right" />
    </span>
  );
}
