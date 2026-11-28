import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Content } from "@/lib/content";
import { Ring } from "./Brand";
import { Reveal, SplitText } from "./Motion";
import { Sheet } from "./Sheet";

/** Small uppercase line with a leading rule. One per section, above the heading. */
export function Kicker({ children, light = false, className = "" }: { children: ReactNode; light?: boolean; className?: string }) {
  return (
    <p className={`label-mono flex items-center gap-4 ${light ? "text-white/60" : "text-navy-800/70"} ${className}`}>
      <span className={`h-px w-10 ${light ? "bg-white/35" : "bg-navy-800/35"}`} aria-hidden />
      {children}
    </p>
  );
}

/** Inner-page header: full-bleed real photo under navy, a monumental title, the intro on a rule. */
export function PageHero({ kicker, title, intro, image }: { kicker?: string; title: string; intro?: string; image?: string }) {
  return (
    <section className="on-dark relative isolate flex min-h-[62svh] items-end overflow-hidden bg-navy-900 text-white">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" fetchPriority="high" className={`absolute inset-0 -z-20 size-full object-cover ${image.endsWith(".svg") ? "" : "photo"}`} />
      )}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(8_21_33/0.55)_0%,rgb(8_21_33/0.35)_40%,rgb(8_21_33/0.95)_100%)]" aria-hidden />
      {!image?.endsWith(".svg") && <div className="blueprint absolute inset-0 -z-10 opacity-60" aria-hidden />}
      <div className="container-x w-full pt-36 pb-14 sm:pb-20">
        {kicker && (
          <Reveal onMount>
            <Kicker light>{kicker}</Kicker>
          </Reveal>
        )}
        <Reveal onMount delay={0.06}>
          <h1 className="display mt-6 max-w-[18ch]">{title}</h1>
        </Reveal>
        {intro && (
          <Reveal onMount delay={0.14}>
            <div className="mt-10 grid gap-6 border-t border-white/20 pt-6 md:grid-cols-12">
              <p className="text-lg leading-relaxed text-white/80 md:col-span-6 md:col-start-7">{intro}</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  lead,
  light = false,
  className = "",
}: {
  kicker?: string;
  title: string;
  lead?: string;
  light?: boolean;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      {kicker && <Kicker light={light}>{kicker}</Kicker>}
      <h2 className={`heading ${kicker ? "mt-6" : ""} ${light ? "!text-white" : ""}`}>{title}</h2>
      {lead && <p className={`mt-6 max-w-2xl ${light ? "text-lg leading-relaxed text-white/75" : "lead"}`}>{lead}</p>}
    </Reveal>
  );
}

/** Every page ends with a clear next step (IPH B4): a compact navy band with the one main action, in the footer's colour so the two read as one closing block. */
export function CtaBand({ c }: { c: Content }) {
  return (
    <Sheet className="on-dark relative isolate overflow-hidden border-b border-white/10 bg-navy-900 text-white">
      <Ring className="-end-20 -bottom-40 size-[26rem] text-white/[0.05]" />
      <div className="container-x grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:items-end lg:gap-16">
        <Reveal className="lg:col-span-7">
          <Kicker light>{c.t("nav.contact")}</Kicker>
          <SplitText text={c.t("home.cta_title")} className="heading mt-6 max-w-3xl !text-white" />
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-5">
          <p className="max-w-md leading-relaxed text-white/75">{c.t("home.cta_text")}</p>
          <Link href={`/${c.lang}/contact`} className="btn-accent mt-7">
            {c.t("home.cta_button")}
            <ArrowUpRight className="flip-rtl size-5" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </Sheet>
  );
}

/** A real photo, full-bleed within its frame (rounded rectangle, never arched or cut into a window). */
export function Photo({ src, alt = "", className = "" }: { src: string; alt?: string; className?: string }) {
  if (!src) return null;
  return (
    <Reveal className={`relative overflow-hidden rounded-md bg-limestone ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" className="photo absolute inset-0 size-full object-cover" />
    </Reveal>
  );
}
