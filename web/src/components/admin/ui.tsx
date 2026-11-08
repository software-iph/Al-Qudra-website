import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({ title, text, actions }: { title: string; text?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-900 sm:text-3xl">{title}</h1>
        {text && <p className="mt-2 max-w-3xl text-[15px] leading-7 text-muted">{text}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, actions, children, className = "", padded = true }: { title?: string; actions?: ReactNode; children: ReactNode; className?: string; padded?: boolean }) {
  return (
    <section className={`rounded-2xl border border-line bg-white shadow-sm ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-6 py-4">
          {title && <h2 className="font-extrabold text-navy-900">{title}</h2>}
          {actions}
        </div>
      )}
      <div className={padded ? "p-6" : ""}>{children}</div>
    </section>
  );
}

export function Field({ label, hint, children, className = "" }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`grid content-start gap-1.5 ${className}`}>
      <span className="text-sm font-bold text-navy-900">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition placeholder:text-muted/60 focus:border-navy-500 focus:ring-4 focus:ring-navy-500/10";

export function Tabs({ items, active }: { items: { href: string; label: string; key: string; count?: number }[]; active: string }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {items.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
            t.key === active ? "bg-navy-700 text-white shadow-md shadow-navy-700/20" : "bg-white text-navy-800 ring-1 ring-line hover:ring-navy-700/30"
          }`}
        >
          {t.label}
          {t.count !== undefined && (
            <span className={`rounded-full px-1.5 text-xs ${t.key === active ? "bg-white/20" : "bg-paper text-muted"}`}>{t.count}</span>
          )}
        </Link>
      ))}
    </div>
  );
}

export function Badge({ tone = "slate", children }: { tone?: "green" | "slate" | "blue" | "red"; children: ReactNode }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    slate: "bg-slate-100 text-slate-600 ring-slate-500/10",
    blue: "bg-sky-soft text-navy-700 ring-navy-700/10",
    red: "bg-red-50 text-red-700 ring-red-600/15",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ${tones[tone]}`}>{children}</span>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-muted">{children}</div>;
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-navy-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-navy-600 disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-navy-800 ring-1 ring-line transition hover:bg-paper",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-bold text-red-600 ring-1 ring-red-200 transition hover:bg-red-600 hover:text-white",
  ghost: "inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-bold text-navy-700 transition hover:bg-paper",
};
