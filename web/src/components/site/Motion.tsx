"use client";

import { animate, motion, MotionConfig, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Site-wide: honour the visitor's "reduce motion" setting (keeps fades, drops movement). */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Fades and lifts its children into view once, as the visitor scrolls. */
export function Reveal({
  children,
  delay = 0,
  duration = 0.9,
  className,
  y = 28,
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
      {...(onMount ? { animate: shown } : { whileInView: shown, viewport: { once: true, margin: "-60px" } })}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Headline that rises in word by word from behind a mask.
 * `onMount` animates immediately (heroes); otherwise when scrolled into view.
 */
export function SplitText({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.06,
  duration = 0.9,
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
  const trigger = onMount ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-60px" } };

  return (
    <Tag className={className} aria-label={text}>
      <motion.span className="block" initial="hide" {...trigger} transition={{ staggerChildren: stagger, delayChildren: delay }} aria-hidden>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden pt-[0.08em] pb-[0.14em] align-bottom -mb-[0.14em]">
            <motion.span
              className="inline-block"
              variants={{ hide: { y: "115%", rotate: 4 }, show: { y: "0%", rotate: 0 } }}
              transition={{ duration, ease: EASE }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/** Photo revealed by a curtain wipe, with a slight zoom settling in. */
export function RevealImage({ src, alt = "", className = "", imgClassName = "", delay = 0 }: { src: string; alt?: string; className?: string; imgClassName?: string; delay?: number }) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      whileInView={{ clipPath: "inset(0 0 0% 0)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.2, delay, ease: EASE }}
    >
      <motion.img
        src={src}
        alt={alt}
        className={`size-full object-cover ${imgClassName}`}
        initial={{ scale: 1.25 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.6, delay, ease: EASE }}
      />
    </motion.div>
  );
}

/**
 * Wraps a hero: as the visitor scrolls past, the background drifts slower
 * than the page (parallax) and the text lifts away and fades.
 */
export function HeroParallax({ background, children, className }: { background: ReactNode; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const fgY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const fgOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} className={className}>
      <motion.div className="absolute inset-0 -z-20" style={{ y: bgY, scale: bgScale }}>
        {background}
      </motion.div>
      <motion.div className="relative w-full" style={{ y: fgY, opacity: fgOpacity }}>
        {children}
      </motion.div>
    </section>
  );
}

/** Small animated "scroll" hint at the bottom of the home hero. */
export function ScrollCue({ label, delay = 1.6 }: { label: string; delay?: number }) {
  return (
    <motion.div
      className="pointer-events-none flex flex-col items-center gap-3 text-[11px] font-bold tracking-[0.3em] text-white/50 uppercase"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1.2 }}
      aria-hidden
    >
      <span className="relative h-12 w-px overflow-hidden bg-white/15">
        <motion.span
          className="absolute inset-x-0 top-0 h-1/2 bg-sky"
          animate={{ y: ["-100%", "200%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </span>
      {label}
    </motion.div>
  );
}

/** Counts up from 0 to `value` whenever it scrolls into view. */
export function CountUp({
  value,
  suffix = "+",
  className,
  suffixClassName,
  duration = 2,
}: {
  value: number | string;
  suffix?: string;
  className?: string;
  suffixClassName?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: false, margin: "0px 0px -80px 0px" });
  const [display, setDisplay] = useState(0);

  const target = typeof value === "number" ? value : parseInt(String(value).replace(/[^\d]/g, ""), 10) || 0;

  useEffect(() => {
    if (!inView) {
      setDisplay(0);
      return;
    }
    const controls = animate(0, target, {
      duration: duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target, duration]);

  return (
    <span ref={ref} className={className} dir="ltr">
      <span className="tabular-nums">{display.toLocaleString("en-US")}</span>
      {suffix && <span className={suffixClassName ?? ""}>{suffix}</span>}
    </span>
  );
}
