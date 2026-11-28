"use client";

import { animate, motion, MotionConfig, useInView } from "motion/react";
import { Fragment, useEffect, useRef, type ElementType, type ReactNode } from "react";

/*
 * ALQUDRA motion: "things settle into place" — like a component set by a crane:
 * a confident start and a long soft landing. 320–480 ms, 8–24 px, scale never
 * above 1.02, no spring, bounce or parallax. Reduced motion keeps fades only.
 */
export const EASE = [0.2, 0, 0, 1] as const; // ease-settle
const SETTLE = 0.48;
const STAGGER = 0.06;


/** Site-wide: honour the visitor's "reduce motion" setting (keeps fades, drops movement). */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Settles its children into place (16 px rise and fade) once, as the visitor scrolls. */
export function Reveal({
  children,
  delay = 0,
  duration = SETTLE,
  className,
  y = 16,
  onMount = false,
}: {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  y?: number;
  /** Animate right away (above-the-fold content) instead of on scroll. */
  onMount?: boolean;
}) {
  const shown = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(onMount ? { animate: shown } : { whileInView: shown, viewport: { once: false, margin: "-60px" } })}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Headline whose words settle up from behind a mask.
 * The whole line lands within ~0.8 s however long it is (stagger shrinks for long lines).
 */
export function SplitText({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = STAGGER,
  duration = SETTLE,
  onMount = false,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  onMount?: boolean;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  const step = Math.min(stagger, (STAGGER * 6) / Math.max(words.length, 1)); // max 6 steps of 60 ms
  const trigger = onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: false, margin: "-60px" } };

  return (
    <Tag className={className} aria-label={text}>
      <motion.span className="block" initial="hide" {...trigger} transition={{ staggerChildren: step, delayChildren: delay }} aria-hidden>
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden pt-[0.08em] pb-[0.14em] align-bottom -mb-[0.14em]">
              <motion.span className="inline-block" variants={{ hide: { y: "100%" }, show: { y: "0%" } }} transition={{ duration, ease: EASE }}>
                {word}
              </motion.span>
            </span>
            {/* The space lives outside the mask: trailing spaces inside an inline-block are dropped. */}
            {i < words.length - 1 && " "}
          </Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}

/**
 * Documentary photo: the frame opens with a straight wipe and the photo settles
 * from 1.02 to 1 (no parallax, no blur — the photo is evidence, not decoration).
 */
export function RevealImage({
  src,
  alt = "",
  className = "",
  imgClassName = "",
  delay = 0,
}: {
  src: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Watch the outer frame (never clipped): a fully clipped element counts as invisible to the browser.
  const shown = useInView(ref, { once: false, margin: "-80px" });
  const state = shown ? "show" : "hide";

  return (
    <div ref={ref} className={`${/\b(absolute|fixed|sticky)\b/.test(className) ? "" : "relative "}overflow-hidden bg-limestone ${className}`}>
      <motion.div
        className="absolute inset-0"
        initial="hide"
        animate={state}
        variants={{ hide: { clipPath: "inset(0 0 100% 0)" }, show: { clipPath: "inset(0 0 0% 0)" } }}
        transition={{ duration: 0.72, delay, ease: EASE }}
      >
        <motion.img
          src={src}
          alt={alt}
          className={`photo size-full object-cover ${imgClassName}`}
          initial="hide"
          animate={state}
          variants={{ hide: { scale: 1.02 }, show: { scale: 1 } }}
          transition={{ duration: 0.96, delay, ease: EASE }}
        />
      </motion.div>
    </div>
  );
}

/** Hero wrapper: background layer behind the content (the brand rules out parallax). */
export function HeroParallax({ background, children, className }: { background: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={className}>
      <div className="absolute inset-0 -z-20">{background}</div>
      <div className="relative w-full">{children}</div>
    </section>
  );
}

/** Small "scroll" hint at the bottom of the home hero. */
export function ScrollCue({ label, delay = 1.2 }: { label: string; delay?: number }) {
  return (
    <motion.div
      className="label-mono pointer-events-none flex flex-col items-center gap-3 text-paper/55"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: SETTLE }}
      aria-hidden
    >
      <span className="relative h-12 w-px overflow-hidden bg-paper/15">
        <motion.span
          className="absolute inset-x-0 top-0 h-1/2 bg-copper"
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: EASE }}
        />
      </span>
      {label}
    </motion.div>
  );
}

/** Counts up from 0 the first time it is seen (the real number is in the HTML). */
export function CountUp({
  value,
  suffix = "+",
  className,
  suffixClassName,
  duration = 1.6,
}: {
  value: number | string;
  suffix?: string;
  className?: string;
  suffixClassName?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const number = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "0px 0px -80px 0px" });

  const target = typeof value === "number" ? value : parseInt(String(value).replace(/[^\d]/g, ""), 10) || 0;
  const format = (n: number) => Math.round(n).toLocaleString("en-US");

  // Counting only changes digits (nothing moves), so it also runs for reduced-motion visitors.
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        if (number.current) number.current.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, target, duration]);

  return (
    <span ref={ref} className={className} dir="ltr">
      <span ref={number} className="tabular-nums">
        {format(target)}
      </span>
      {suffix && <span className={suffixClassName ?? ""}>{suffix}</span>}
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Graphic devices — all taken from the mark. Use one per surface, two at most.
 * ------------------------------------------------------------------------- */

/**
 * The Arc: the Q-symbol's ring, always cropped by its container (never a full
 * circle on screen). Stroke = 6% of the diameter. Place it with `className`
 * (absolute position + size) inside an `overflow-hidden` parent.
 */
export function Arc({ className = "", tone = "text-paper/[0.07]" }: { className?: string; tone?: string }) {
  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={`pointer-events-none absolute ${tone} ${className}`}
      initial={{ opacity: 0, rotate: -6 }}
      whileInView={{ opacity: 1, rotate: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.96, ease: EASE }}
      aria-hidden
    >
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="6" />
    </motion.svg>
  );
}

/**
 * The Tiles: squares that follow the arc's tangent, rotating 10° per step.
 * Signature motion ("tile settle", 480 ms): each tile lands from above with a
 * 60 ms stagger. Only one tile may be Copper (the last).
 */
export function Tiles({
  count = 3,
  size = 14,
  className = "",
  onMount = false,
  dark = false,
}: {
  count?: 1 | 2 | 3;
  size?: number;
  className?: string;
  onMount?: boolean;
  /** On ink surfaces the ink tile becomes paper so all three stay visible. */
  dark?: boolean;
}) {
  const tones = [dark ? "bg-paper" : "bg-ink", dark ? "bg-sky" : "bg-navy-700", "bg-copper"].slice(3 - count);
  const trigger = onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: false, margin: "-40px" } };
  return (
    <motion.span className={`inline-flex items-end ${className}`} initial="hide" {...trigger} transition={{ staggerChildren: STAGGER }} aria-hidden>
      {tones.map((tone, i) => (
        <motion.span
          key={tone}
          className={`block ${tone}`}
          style={{ width: size, height: size, marginInlineStart: i ? size * 0.45 : 0, marginTop: i * size * 0.55 }}
          variants={{
            hide: { opacity: 0, y: -16, rotate: 20 + i * 10 - 10 },
            show: { opacity: 1, y: 0, rotate: 20 + i * 10 },
          }}
          transition={{ duration: SETTLE, ease: EASE }}
        />
      ))}
    </motion.span>
  );
}

/**
 * The Measured Rule: a drafting scale used as a divider, with a mono label.
 * It draws itself along its length when seen ("this was measured").
 */
export function MeasuredRule({ label, className = "", light = false }: { label?: string; className?: string; light?: boolean }) {
  const ticks = Array.from({ length: 41 }, (_, i) => i); // every 2.5 units, major every 25
  const tone = light ? "text-paper/45" : "text-concrete";
  return (
    <div className={`${tone} ${className}`} aria-hidden>
      <motion.svg
        viewBox="0 0 400 22"
        preserveAspectRatio="none"
        className="block h-5 w-full origin-left rtl:origin-right"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: false, margin: "-40px" }}
        transition={{ duration: 0.96, ease: EASE }}
      >
        <line x1="0" y1="21.5" x2="400" y2="21.5" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {ticks.map((t) => {
          const x = Math.min(t * 10, 399.5);
          const h = t % 10 === 0 ? 14 : t % 5 === 0 ? 9 : 5;
          return <line key={t} x1={x} y1={22 - h} x2={x} y2="22" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />;
        })}
      </motion.svg>
      {label && <p className="label-mono mt-3">{label}</p>}
    </div>
  );
}
