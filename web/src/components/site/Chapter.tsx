"use client";

import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

const EASE = [0.2, 0, 0, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/*
 * After the hero every page reads as one engineering "site record". Each chapter opens with a
 * title bar — a full-width hairline carrying the chapter number and its label (and an optional
 * note at the far end), like the title block of a drawing — and its content then uses the full
 * container width. (An earlier side rail left a quarter of the page empty; the bar keeps the
 * numbering without spending a column on it.)
 */

/** Chapter title bar: "01  OUR STORY ··········· note" on a hairline. */
export function ChapterIndex({ n, label, light = false, aside }: { n: number; label: string; light?: boolean; aside?: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-60px" }}
      transition={{ duration: 0.5, ease: EASE }}
      className={`flex items-baseline gap-5 border-t pt-5 ${light ? "border-white/15" : "border-navy-800/15"}`}
    >
      <span className={`font-display text-sm font-bold tabular-nums ${light ? "text-white" : "text-navy-800"}`}>
        <bdi dir="ltr">{pad(n)}</bdi>
      </span>
      <span className={`label-mono ${light ? "text-white/60" : "text-navy-800/70"}`}>{label}</span>
      {aside && <span className={`label-mono ms-auto tabular-nums ${light ? "text-white/45" : "text-concrete"}`}>{aside}</span>}
    </motion.div>
  );
}

/** Rail label without a number, for a sub-part of a chapter ("In numbers", "At a glance"). */
export function RailLabel({ children, light = false, className = "" }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <p className={`label-mono flex items-center gap-4 ${light ? "text-white/60" : "text-navy-800/70"} ${className}`}>
      <span className={`h-px w-10 ${light ? "bg-white/35" : "bg-navy-800/35"}`} aria-hidden />
      {children}
    </p>
  );
}

/**
 * Specification table: label | value rows on hairlines, like a data sheet.
 * Used for "At a glance" facts and contact details. Rows with an href become links.
 */
export function SpecList({
  rows,
  light = false,
  stacked = false,
  compact = false,
  columns = 1,
}: {
  rows: { label: string; value: ReactNode; href?: string; ltr?: boolean }[];
  light?: boolean;
  /** Label above value, for narrow columns. */
  stacked?: boolean;
  /** Smaller values, for a side data box. */
  compact?: boolean;
  /** Two columns of rows from the sm breakpoint. */
  columns?: 1 | 2;
}) {
  const line = light ? "border-white/12" : "border-navy-800/15";
  return (
    <dl className={`border-t ${line} ${columns === 2 ? "grid sm:grid-cols-2 sm:gap-x-10" : ""}`}>
      {rows.map((r) => {
        const value = (
          <span className="break-words" dir={r.ltr ? "ltr" : undefined}>
            {r.value}
          </span>
        );
        return (
          <div key={r.label} className={`grid gap-1.5 border-b ${compact ? "py-3.5" : "py-5"} ${stacked ? "" : "sm:grid-cols-[minmax(9rem,1fr)_2.4fr] sm:gap-8"} ${line}`}>
            <dt className={`label-mono pt-1 ${light ? "text-white/55" : "text-concrete"}`}>{r.label}</dt>
            <dd className={`leading-snug font-bold ${compact ? "text-[15px]" : "text-lg"} ${light ? "text-white" : "text-ink"}`}>
              {r.href ? (
                <a
                  href={r.href}
                  target={r.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className={`underline decoration-1 underline-offset-[6px] transition-colors duration-[160ms] ${light ? "decoration-white/30 hover:decoration-white" : "decoration-navy-800/25 hover:decoration-navy-800"}`}
                >
                  {value}
                </a>
              ) : (
                value
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

/** A chapter: its title bar (or a sub-label) above, the content across the full width below. */
export function ChapterGrid({ rail, children, className = "" }: { rail?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`container-x ${className}`}>
      {rail && <div className="mb-10 sm:mb-14">{rail}</div>}
      {children}
    </div>
  );
}

/**
 * A photo set like a figure in a report: a quiet 4:5 frame with a mono caption.
 * The photo drifts slowly inside the frame as the page scrolls (the frame itself never moves).
 */
export function Figure({
  src,
  caption,
  n = 1,
  className = "",
  light = true,
  square = false,
}: {
  src: string;
  caption: string;
  n?: number;
  className?: string;
  /** true on navy surfaces */
  light?: boolean;
  /** 1:1 instead of 4:5, so it ends level with a shorter text column */
  square?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);
  if (!src) return null;
  return (
    <figure ref={ref} className={className}>
      <div className={`relative aspect-[4/3] overflow-hidden rounded-[4px] ${square ? "md:aspect-square" : "md:aspect-[4/5]"} ${light ? "bg-navy-850" : "bg-limestone"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img src={src} alt="" loading="lazy" className="photo absolute inset-x-0 -top-[8%] h-[116%] w-full object-cover" style={reduce ? undefined : { y }} />
      </div>
      <figcaption className={`mt-4 flex items-baseline gap-3 border-t pt-4 ${light ? "border-white/12" : "border-navy-800/15"}`}>
        <span className={`label-mono shrink-0 whitespace-nowrap tabular-nums ${light ? "text-white/85" : "text-navy-800"}`} dir="ltr">
          Fig. {pad(n)}
        </span>
        <span className={`text-sm leading-snug ${light ? "text-white/60" : "text-muted"}`}>{caption}</span>
      </figcaption>
    </figure>
  );
}

/**
 * Confirmed figures as a data sheet: a hairline that draws across, then for each column a
 * mono label over the figure, which counts up. Replays each time it comes back into view.
 */
export function DataSheet({ items, light = true }: { items: { id: number; value: string; label: string }[]; /** true on navy */ light?: boolean }) {
  const ref = useRef<HTMLDListElement>(null);
  const seen = useInView(ref, { margin: "0px 0px -80px 0px" });
  const t = light
    ? { rule: "bg-white/12", draw: "bg-white/60", line: "border-white/12", label: "text-white/55", value: "text-white", plus: "text-patina-400" }
    : { rule: "bg-navy-800/15", draw: "bg-navy-800/60", line: "border-navy-800/15", label: "text-concrete", value: "text-navy-900", plus: "text-patina-700" };
  return (
    <dl ref={ref} className="relative grid sm:grid-cols-3">
      <span className={`absolute inset-x-0 top-0 h-px ${t.rule}`} aria-hidden />
      <motion.span
        className={`absolute inset-x-0 top-0 h-px origin-left rtl:origin-right ${t.draw}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: seen ? 1 : 0 }}
        transition={{ duration: 1.2, ease: EASE }}
        aria-hidden
      />
      {items.map((s, i) => {
        const delay = 0.2 + i * 0.18;
        return (
          <motion.div
            key={s.id}
            className={`flex flex-col pt-7 pb-2 max-sm:border-b max-sm:pb-7 sm:pe-8 ${t.line} ${i ? "sm:border-s sm:ps-8" : ""}`}
            initial={{ opacity: 0, y: 14 }}
            animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.6, delay, ease: EASE }}
          >
            <dt className={`label-mono pb-5 ${t.label}`}>{s.label}</dt>
            <dd className={`mt-auto font-display text-[clamp(3rem,5.4vw,5.25rem)] leading-[0.9] font-bold tracking-[-0.04em] ${t.value}`}>
              <Count value={Number(s.value) || 0} start={seen} delay={delay} plus={t.plus} />
            </dd>
          </motion.div>
        );
      })}
    </dl>
  );
}

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Counts up from zero when `start` turns on; the real figure is in the HTML for no-JS and search engines. */
function Count({ value, start, delay, plus }: { value: number; start: boolean; delay: number; plus: string }) {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!el.current) return;
    if (!start) {
      el.current.textContent = fmt(0);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (el.current) el.current.textContent = fmt(v);
      },
    });
    return () => controls.stop();
  }, [start, value, delay]);
  return (
    <bdi dir="ltr">
      <span ref={el} className="tabular-nums">
        {fmt(value)}
      </span>
      <span className={plus}>+</span>
    </bdi>
  );
}
