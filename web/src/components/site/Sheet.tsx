"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * A full-bleed navy section whose background stays still while its content glides
 * up into place as the section scrolls in (and back down if you scroll up again).
 * The colour edge itself never moves, so there is no gap or white margin.
 * Scroll-linked (moves only while the visitor scrolls), so it runs for everyone and the server
 * and browser render the same markup.
 */
export function Sheet({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
  const y = useTransform(scrollYProgress, [0, 1], [90, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [0.25, 1]);

  return (
    <section ref={ref} id={id} className={className}>
      <motion.div style={{ y, opacity }}>{children}</motion.div>
    </section>
  );
}
