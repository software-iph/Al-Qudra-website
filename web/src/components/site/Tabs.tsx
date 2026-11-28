"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

/**
 * Text tabs on a hairline (WAI-ARIA tabs pattern): one panel shows at a time, so related lists
 * (methodology, values, strengths, goals) share one place instead of four stacked sections.
 * Every panel stays in the HTML (hidden), so search engines and no-JS visitors still get it all.
 * Keyboard: ←/→ (mirrored in Arabic), Home and End move between tabs.
 */
export function Tabs({ tabs, label, light = false }: { tabs: { id: string; label: string; panel: ReactNode }[]; label: string; light?: boolean }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const focus = (i: number) => {
    const next = (i + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const rtl = getComputedStyle(e.currentTarget).direction === "rtl";
    if (e.key === "ArrowRight") focus(active + (rtl ? -1 : 1));
    else if (e.key === "ArrowLeft") focus(active + (rtl ? 1 : -1));
    else if (e.key === "Home") focus(0);
    else if (e.key === "End") focus(tabs.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div>
      <div role="tablist" aria-label={label} onKeyDown={onKey} className={`flex flex-wrap gap-x-8 gap-y-2 border-b ${light ? "border-white/15" : "border-navy-800/15"}`}>
        {tabs.map((t, i) => {
          const on = i === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              id={`${base}-tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={on}
              aria-controls={`${base}-panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative -mb-px border-b-2 py-4 text-[15px] font-bold transition-colors duration-[200ms] ${
                on
                  ? light
                    ? "border-white text-white"
                    : "border-navy-800 text-ink"
                  : light
                    ? "border-transparent text-white/50 hover:text-white/85"
                    : "border-transparent text-muted hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          id={`${base}-panel-${t.id}`}
          role="tabpanel"
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={i !== active}
          tabIndex={0}
          className="aq-tabpanel pt-10 outline-none"
        >
          {t.panel}
        </div>
      ))}
    </div>
  );
}
