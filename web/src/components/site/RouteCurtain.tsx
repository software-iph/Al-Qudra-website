"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PATH, VIEWBOX } from "./Brand";

type Phase = "intro" | "idle" | "cover" | "reveal";
const COVER_MS = 560; // how long the curtain takes to rise over the page
const REVEAL_MS = 820; // how long it takes to lift off the next page
const MAX_WAIT_MS = 6000; // never hold the screen longer than this

/**
 * ALQUDRA loading curtain (navy, with the Q symbol drawing itself).
 * - First load: the symbol draws, the wordmark settles, then the curtain lifts (pure CSS, so it
 *   lifts even before JavaScript runs).
 * - Every page change: the curtain rises over the page when a link is clicked, waits (symbol
 *   breathing, line running) until the next page is ready, then lifts off it.
 * Reduced motion: the curtain is never shown (see globals.css).
 */
export function RouteCurtain() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("intro");
  const coveredAt = useRef(0);
  const target = useRef<string | null>(null);
  const timers = useRef<number[]>([]);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // The intro finishes on its own (CSS); return to idle afterwards so the next cover starts clean.
  useEffect(() => {
    const t = window.setTimeout(() => setPhase((p) => (p === "intro" ? "idle" : p)), 2800);
    return () => clearTimeout(t);
  }, []);

  // Cover the page as soon as an internal link to another page is clicked.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      clear();
      target.current = url.pathname;
      coveredAt.current = performance.now();
      setPhase("cover");
      later(() => setPhase("reveal"), MAX_WAIT_MS); // safety net
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // The new page is in place: lift the curtain once it has fully covered the old one.
  useEffect(() => {
    if (phase !== "cover" || pathname !== target.current) return;
    clear();
    const wait = Math.max(0, COVER_MS + 120 - (performance.now() - coveredAt.current));
    later(() => setPhase("reveal"), wait);
  }, [pathname, phase]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const t = window.setTimeout(() => setPhase("idle"), REVEAL_MS + 40);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => clear, []);

  return (
    <div className="aq-curtain on-dark" data-phase={phase} aria-hidden>
      <div className="blueprint absolute inset-0 opacity-30" />
      <span className="aq-curtain-edge" />
      <div className="aq-curtain-inner">
        <svg viewBox={VIEWBOX} className="aq-mark" aria-hidden>
          <path d={PATH} fillRule="evenodd" pathLength={1} />
        </svg>
        <p className="aq-wordmark" dir="ltr">
          {"ALQUDRA".split("").map((ch, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties}>
              {ch}
            </span>
          ))}
        </p>
        <span className="aq-curtain-line" />
      </div>
    </div>
  );
}
