"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/content";

/** Masonry photo grid with a full-screen viewer (arrow keys, swipe-free buttons, Esc). */
export function GalleryGrid({ items, rtl }: { items: GalleryItem[]; rtl: boolean }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(rtl ? -1 : 1);
      if (e.key === "ArrowLeft") step(rtl ? 1 : -1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step, rtl]);

  const current = index === null ? null : items[index];

  return (
    <>
      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => setIndex(i)}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="group relative mb-5 block w-full overflow-hidden rounded-3xl bg-paper text-start"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.src} alt={item.caption} loading="lazy" className="w-full transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            {item.caption && (
              <span className="absolute inset-x-5 bottom-4 translate-y-2 text-sm font-bold text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {item.caption}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-950/95 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            role="dialog"
            aria-modal="true"
          >
            <motion.figure
              key={current.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.src} alt={current.caption} className="max-h-[80vh] w-auto rounded-2xl object-contain" />
              {current.caption && <figcaption className="mt-4 text-center text-white/80">{current.caption}</figcaption>}
            </motion.figure>
            <button type="button" onClick={close} aria-label="Close" className="absolute top-5 end-5 flex size-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20">
              <X className="size-6" />
            </button>
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label="Previous"
                  className="absolute start-4 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeft className="flip-rtl size-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label="Next"
                  className="absolute end-4 top-1/2 flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRight className="flip-rtl size-6" />
                </button>
              </>
            )}
            <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-white/60" dir="ltr">
              {(index ?? 0) + 1} / {items.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
