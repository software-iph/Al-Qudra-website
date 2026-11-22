import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Content } from "@/lib/content";
import { Icon } from "./Icon";
import { CountUp, HeroParallax, Reveal, SplitText } from "./Motion";

/** Dark photo header used at the top of every inner page. */
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
    <HeroParallax
      className="relative isolate overflow-hidden bg-navy-950 pt-40 pb-24 text-white sm:pt-48 sm:pb-32"
      background={
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="aq-hero-video size-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-900/40" aria-hidden />
          <div className="grid-lines absolute inset-0" aria-hidden />
        </>
      }
    >
      <div className="container-x">
        <Reveal onMount y={12}>
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/60" aria-label="Breadcrumb">
            <Link href={`/${c.lang}`} className="hover:text-white">
              {c.t("nav.home")}
            </Link>
            <ChevronRight className="flip-rtl size-4" aria-hidden />
            <span className="text-white">{title}</span>
          </nav>
        </Reveal>
        <SplitText as="h1" onMount delay={0.1} text={title} className="max-w-3xl text-4xl leading-tight font-extrabold sm:text-6xl rtl:leading-[1.35]" />
        {intro && (
          <Reveal onMount delay={0.45}>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{intro}</p>
          </Reveal>
        )}
        <Reveal onMount delay={0.6} y={0}>
          <span className="aq-line mt-10 block h-px w-24 origin-left bg-sky rtl:origin-right" />
        </Reveal>
      </div>
    </HeroParallax>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  center,
  light,
  children,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  center?: boolean;
  light?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <Reveal y={10}>
          <p className={`eyebrow ${light ? "text-sky" : ""} ${center ? "justify-center" : ""}`}>{eyebrow}</p>
        </Reveal>
      )}
      <SplitText text={title} delay={0.08} stagger={0.045} className={`heading mt-4 ${light ? "text-white" : ""}`} />
      {text && (
        <Reveal delay={0.25}>
          <p className={`lead mt-5 ${light ? "text-white/65" : ""}`}>{text}</p>
        </Reveal>
      )}
      {children}
    </div>
  );
}

/** The signature Q³ methodology block (dark). */
export function Q3Section({ c }: { c: Content }) {
  const pillars = c.items("q3");
  return (
    <section className="relative isolate overflow-hidden bg-navy-900 py-24 text-white sm:py-32">
      <div className="grid-lines absolute inset-0 -z-10" aria-hidden />
      <div className="absolute -bottom-48 start-[-10%] -z-10 size-[600px] rounded-full bg-navy-500/25 blur-3xl" aria-hidden />
      <div className="container-x grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading light eyebrow={c.t("home.q3_eyebrow")} title={c.t("home.q3_title")} text={c.t("home.q3_text")} />
          <Reveal delay={0.1} className="relative mt-10 hidden overflow-hidden rounded-3xl lg:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.media("home.q3_image")} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-navy-900/80 to-transparent" />
            <span className="absolute bottom-6 start-6 text-7xl font-extrabold text-white" dir="ltr">
              Q<sup className="text-sky">3</sup>
            </span>
          </Reveal>
        </div>
        <div className="grid gap-5 lg:col-span-7">
          {pillars.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.1}>
              <div className="group relative flex gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition duration-500 hover:border-sky/40 hover:bg-white/[0.07] sm:p-9">
                <span className="text-5xl font-extrabold text-white/10 transition group-hover:text-sky/40" dir="ltr">
                  0{i + 1}
                </span>
                <div>
                  <div className="flex items-center gap-3">
                    <Icon name={p.icon} className="size-6 text-sky" />
                    <h3 className="text-2xl font-extrabold">{p.title}</h3>
                  </div>
                  <p className="mt-3 leading-8 text-white/65">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Icon cards grid (values, strengths, goals). */
export function CardGrid({ items, columns = 4 }: { items: ReturnType<Content["items"]>; columns?: 3 | 4 }) {
  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((item, i) => (
        <Reveal key={item.id} delay={(i % columns) * 0.07}>
          <div className="card group h-full">
            <div className="icon-tile group-hover:bg-navy-700 group-hover:text-white">
              <Icon name={item.icon} className="size-6" />
            </div>
            <h3 className="mt-6 text-lg font-extrabold text-navy-900">{item.title}</h3>
            <p className="mt-3 leading-7 text-muted">{item.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Modern animated stats showcase. */
export function StatsShowcase({ items }: { items: ReturnType<Content["items"]> }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="relative isolate py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-transparent via-slate-50/70 to-transparent">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center" aria-hidden>
        <div className="h-72 w-[700px] rounded-full bg-gradient-to-r from-sky-soft/50 via-sky/15 to-transparent blur-3xl opacity-80" />
      </div>

      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
          {items.map((s, i) => (
            <Reveal
              key={s.id}
              delay={i * 0.15}
              y={35}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[2.25rem] border border-slate-200/80 bg-white/90 p-8 sm:p-10 shadow-[0_20px_50px_-15px_rgba(7,19,34,0.06)] backdrop-blur-xl transition-all duration-700 ease-out-expo hover:-translate-y-2.5 hover:border-sky/50 hover:shadow-[0_30px_70px_-15px_rgba(7,19,34,0.14)]"
            >
              {/* Top Bar: Icon + Modern Badge */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex size-14 sm:size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-paper to-sky-soft/70 text-navy-800 shadow-sm border border-white transition-all duration-500 ease-out-expo group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-navy-800 group-hover:to-navy-950 group-hover:text-sky group-hover:shadow-lg">
                  <Icon name={s.icon} className="size-7 sm:size-8" />
                </div>
                <div className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-paper/90 px-3.5 py-1.5 text-xs font-black tracking-widest text-navy-600 transition-colors group-hover:border-sky/40 group-hover:bg-sky-soft/40 group-hover:text-navy-900" dir="ltr">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-sky" />
                  </span>
                  0{i + 1}
                </div>
              </div>

              {/* Number and Label */}
              <div className="mt-8 sm:mt-10">
                <div className="whitespace-nowrap" dir="ltr">
                  <CountUp
                    value={s.body}
                    suffix="+"
                    suffixClassName="text-3xl sm:text-4xl lg:text-5xl font-black text-sky ms-1 inline-block"
                    className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-950 tracking-tight"
                  />
                </div>
                <p className="mt-3 text-base sm:text-lg font-extrabold text-navy-800 leading-snug">
                  {s.title}
                </p>
              </div>

              {/* Animated Progress Indicator Line */}
              <div className="mt-8 h-1.5 w-12 rounded-full bg-slate-100 transition-all duration-700 ease-out-expo group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-sky group-hover:to-navy-700" />

              {/* Ambient Spotlight inside card */}
              <div
                className="pointer-events-none absolute -bottom-16 -end-16 size-48 rounded-full bg-sky/15 blur-3xl transition-all duration-700 group-hover:scale-150 group-hover:bg-sky/25"
                aria-hidden
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Closing call-to-action banner with photo. */
export function CtaBand({ c }: { c: Content }) {
  return (
    <section className="container-x py-24">
      <Reveal>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-navy-800 px-8 py-16 text-white sm:px-16 sm:py-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.media("home.cta_image")} alt="" className="absolute inset-0 -z-20 size-full object-cover opacity-30" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-800/40 rtl:bg-gradient-to-l" />
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">{c.t("home.cta_title")}</h2>
              <p className="mt-5 text-lg leading-8 text-white/70">{c.t("home.cta_text")}</p>
            </div>
            <Link href={`/${c.lang}/contact`} className="btn-light px-8 py-4 text-base">
              {c.t("home.cta_button")}
              <ArrowUpRight className="flip-rtl size-5" aria-hidden />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
