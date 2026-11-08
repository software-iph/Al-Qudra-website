import { ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Content } from "@/lib/content";
import { Icon } from "./Icon";
import { HeroParallax, Reveal, SplitText } from "./Motion";

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
