"use client";

import { motion } from "motion/react";
import { useLayoutEffect } from "react";

/** Re-mounts on every navigation: start at the top, and fade the page softly into place. */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    // Links to a section (e.g. /services#service-2) keep their target.
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
}
