import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Content } from "@/lib/content";
import { Icon } from "./Icon";
import { Arc, CountUp, Reveal, RevealImage, SplitText, Tiles } from "./Motion";

/** Ink header at the top of every inner page: documentary photo, ink gradient from the text side, the Arc. */
export function PageHero({
  c,
  title,
  intro,
  image,
}: {
  c: Content;
  title: string;
  intro?: string;
  image: string;
}) {
  return (
    <section className="relative isolate flex min-h-[min(68svh,40rem)] items-end overflow-hidden bg-navy-900 pt-40 pb-16 text-paper sm:pb-20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image} alt="" className="photo absolute inset-0 -z-20 size-full object-cover opacity-60" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/70 to-navy-900/0 rtl:bg-gradient-to-l" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-navy-900/90 to-transparent" aria-hidden />
      <Arc className="-end-40 -bottom-56 size-[34rem] sm:-end-24" tone="text-paper/[0.09]" />

      <div className="container-x">
        <Reveal onMount y={8}>
          <nav className="label-mono mb-6 flex items-center gap-2 text-paper/60" aria-label="Breadcrumb">
            <Link href={`/${c.lang}`} className="transition-colors duration-[120ms] hover:text-paper">
              {c.t("nav.home")}
            </Link>
            <ChevronRight className="flip-rtl size-3.5" aria-hidden />
            <span className="text-paper">{title}</span>
          </nav>
        </Reveal>
        <SplitText as="h1" onMount delay={0.1} text={title} className="display max-w-4xl" />
        {intro && (
          <Reveal onMount delay={0.4}>
            <p className="mt-6 max-w-xl text-lg leading-8 text-paper/80">{intro}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

export function SectionHeading({
  title,
  text,
  center,
  light,
  children,
}: {
  title: string;
  text?: string;
  center?: boolean;
  light?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      <SplitText text={title} className={`heading ${light ? "!text-paper" : ""}`} />
      {text && (
        <Reveal delay={0.2}>
          <p className={`lead mt-5 ${light ? "!text-paper/70" : ""}`}>{text}</p>
        </Reveal>
      )}
      {children}
    </div>
  );
}

/** The Q³ methodology: a documentary photo beside the three pillars, divided by hairlines (ink). */
export function Q3Section({ c }: { c: Content }) {
  const pillars = c.items("q3");
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-paper">
      <div className="grid lg:min-h-[44rem] lg:grid-cols-2">
        <div className="relative min-h-[22rem] lg:min-h-full">
          <RevealImage src={c.media("home.q3_image")} className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/10 to-transparent lg:bg-gradient-to-l rtl:lg:bg-gradient-to-r" aria-hidden />
          <span className="absolute bottom-6 start-6 text-7xl font-black sm:bottom-10 sm:start-10 sm:text-8xl" style={{ fontStretch: "125%" }} dir="ltr" aria-hidden>
            Q<sup className="text-sky">3</sup>
          </span>
        </div>
        <div className="relative flex items-center overflow-hidden px-5 py-20 sm:px-10 lg:px-16 lg:py-24 xl:px-24">
          <Arc className="-end-48 -top-48 size-[30rem]" />
          <div className="relative max-w-xl">
            <SectionHeading light title={c.t("home.q3_title")} />
            <ul className="mt-12 border-t border-paper/15">
              {pillars.map((p, i) => (
                <Reveal key={p.id} delay={0.1 + i * 0.06}>
                  <li className="flex gap-5 border-b border-paper/15 py-7">
                    <Icon name={p.icon} className="mt-1 size-6 shrink-0 text-sky" strokeWidth={1.25} />
                    <div>
                      <h3 className="text-xl font-bold" style={{ fontStretch: "112%" }}>
                        {p.title}
                      </h3>
                      <p className="mt-2 leading-7 text-paper/70">{p.body}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Icon + title + text, laid on a hairline grid (no boxed cards). */
export function CardGrid({ items, columns = 4 }: { items: ReturnType<Content["items"]>; columns?: 3 | 4 }) {
  return (
    <div className={`grid border-t border-line sm:grid-cols-2 ${columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((item, i) => (
        <Reveal key={item.id} delay={(i % columns) * 0.06}>
          <div className="group h-full border-b border-line py-8 sm:pe-8">
            <Icon name={item.icon} className="size-7 text-navy-700" strokeWidth={1.25} />
            <h3 className="mt-6 text-lg font-bold text-ink">{item.title}</h3>
            <p className="mt-3 leading-7 text-muted">{item.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Headline numbers: set like figures in a site report, divided by hairlines, ending in the Measured Rule. */
export function StatsShowcase({ items }: { items: ReturnType<Content["items"]> }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <dl className="grid border-y border-line md:grid-cols-3">
          {items.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06} className="border-line py-10 md:border-s md:px-10 md:first:border-s-0 md:first:ps-0 [&:not(:first-child)]:border-t md:[&:not(:first-child)]:border-t-0">
              <dt className="flex items-center gap-3 text-muted">
                <Icon name={s.icon} className="size-5 text-navy-700" strokeWidth={1.25} />
                <span className="font-semibold">{s.title}</span>
              </dt>
              <dd className="mt-6 whitespace-nowrap" dir="ltr">
                <CountUp
                  value={s.body}
                  suffix="+"
                  suffixClassName="ms-1 text-copper"
                  className="text-6xl font-black tracking-[-0.03em] text-ink sm:text-7xl"
                />
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** Closing call to action: ink panel over a documentary photo, the one Copper action. */
export function CtaBand({ c }: { c: Content }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 text-paper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={c.media("home.cta_image")} alt="" className="photo absolute inset-0 -z-20 size-full object-cover opacity-45" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/80 to-navy-900/20 rtl:bg-gradient-to-l" aria-hidden />
      <div className="container-x grid items-end gap-10 py-24 sm:py-32 lg:grid-cols-[1fr_auto]">
        <div className="max-w-2xl">
          <Tiles dark className="mb-8" />
          <SplitText text={c.t("home.cta_title")} className="heading !text-paper" />
        </div>
        <Reveal delay={0.2}>
          <Link href={`/${c.lang}/contact`} className="btn-accent px-8 py-4 text-base">
            {c.t("home.cta_button")}
            <ArrowUpRight className="flip-rtl size-5" aria-hidden />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
