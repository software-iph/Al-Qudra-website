import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { CtaBand, Q3Section, StatsShowcase } from "@/components/site/Blocks";
import { GalleryMarquee } from "@/components/site/GalleryMarquee";
import { HeroParallax, RevealImage, Reveal, ScrollCue, SplitText } from "@/components/site/Motion";
import { SmartVideo } from "@/components/site/SmartVideo";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { Icon } from "@/components/site/Icon";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);
  const stats = c.items("stats");

  return (
    <>
      {/* ---------- Hero ---------- */}
      <HeroParallax
        className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-navy-950 pt-32 pb-10 text-white"
        background={
          <>
            <SmartVideo src={c.media("home.hero_video")} poster={c.media("home.hero_poster")} eager className="aq-hero-video size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/30" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 to-transparent rtl:bg-gradient-to-l" aria-hidden />
            <div className="grid-lines absolute inset-0 opacity-50" aria-hidden />
          </>
        }
      >
        <div className="container-x">
          <div className="max-w-4xl">
            <Reveal onMount delay={1.8} duration={1.4}>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white/85 backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-sky" />
                </span>
                {c.t("home.hero_eyebrow")}
              </p>
            </Reveal>
            <SplitText
              as="h1"
              onMount
              delay={2.1}
              duration={1.4}
              stagger={0.07}
              text={c.t("home.hero_title")}
              className="mt-7 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-6xl lg:text-7xl rtl:leading-[1.3] rtl:tracking-normal"
            />
            <Reveal onMount delay={2.7} duration={1.4}>
              <p className="mt-6 max-w-xl text-lg sm:text-xl leading-relaxed text-white/80">{c.t("home.hero_text")}</p>
            </Reveal>
            <Reveal onMount delay={3.2} duration={1.2}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={`/${lang}/about#services`} className="btn-light group px-7 py-4 text-base">
                  {c.t("home.hero_primary")}
                  <ArrowRight className="flip-rtl size-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                </Link>
                <Link href={`/${lang}/contact`} className="btn-ghost px-7 py-4 text-base">
                  {c.t("home.hero_secondary")}
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="mt-12 hidden justify-center lg:flex">
            <ScrollCue label={c.t("nav.scroll")} delay={3.6} />
          </div>
        </div>
      </HeroParallax>

      {/* ---------- Who we are ---------- */}
      <section className="relative isolate overflow-hidden py-28 sm:py-36 bg-gradient-to-b from-white via-paper/40 to-white">
        {/* Soft background glow */}
        <div className="pointer-events-none absolute -start-20 top-1/3 -z-10 size-96 rounded-full bg-sky-soft/40 blur-3xl" aria-hidden />

        <div className="container-x grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          <div className="relative pb-16 lg:pb-0">
            {/* Primary Image Frame with soft glow & border */}
            <div className="relative rounded-[2.5rem] p-2 ring-1 ring-black/5 bg-gradient-to-br from-white to-paper shadow-2xl">
              <RevealImage src={c.media("home.about_image")} className="aspect-[4/5] rounded-[2rem] sm:aspect-square object-cover" />
            </div>

            {/* Overlapping Secondary Image with high depth */}
            <Reveal delay={0.4} y={40} className="absolute -bottom-4 end-0 w-7/12 overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl shadow-navy-950/20 sm:-end-8 lg:-bottom-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.media("home.about_image_2")} alt="" className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105" />
            </Reveal>

            {/* Engineering Excellence Badge */}
            <Reveal delay={0.6} y={16} className="absolute start-4 top-4 sm:start-6 sm:top-6">
              <div className="aq-float flex items-center gap-3.5 rounded-2xl border border-white/80 bg-white/95 px-5 py-4 shadow-xl shadow-navy-950/10 backdrop-blur-xl">
                <span className="flex size-10 items-center justify-center rounded-xl bg-navy-700 text-sky shadow-inner">
                  <Icon name="shield-check" className="size-5" />
                </span>
                <div>
                  <span className="block text-xs font-black tracking-widest text-navy-500 uppercase">Al-Qudra Quality</span>
                  <span className="text-sm font-extrabold text-navy-950">{c.t("about.title")}</span>
                </div>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal y={12}>
              <div className="inline-flex items-center gap-2 rounded-full border border-navy-700/10 bg-navy-700/5 px-4 py-1.5 text-xs font-bold text-navy-700 uppercase tracking-wider mb-5">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-sky" />
                </span>
                {c.t("home.about_eyebrow")}
              </div>
            </Reveal>

            <SplitText text={c.t("home.about_title")} delay={0.1} className="heading" />

            <Reveal delay={0.25}>
              <p className="lead mt-6 text-lg sm:text-xl text-muted font-normal leading-relaxed">
                {c.t("home.about_text")}
              </p>
            </Reveal>

            <Reveal delay={0.35}>
              <div className="mt-10 grid gap-3.5 sm:grid-cols-2">
                {c.items("values").slice(0, 4).map((v) => (
                  <div key={v.id} className="group/item flex items-center gap-3.5 rounded-2xl border border-line/80 bg-paper/60 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-sky/50 hover:bg-white hover:shadow-lg hover:shadow-navy-900/5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-navy-700 shadow-sm transition-colors duration-300 group-hover/item:bg-navy-700 group-hover/item:text-white">
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                    <span className="text-sm sm:text-[15px] font-extrabold text-navy-900 transition-colors group-hover/item:text-navy-700">
                      {v.title}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex items-center gap-4">
                <Link href={`/${lang}/about`} className="btn-primary group px-8 py-4 text-base font-bold shadow-xl shadow-navy-700/20">
                  {c.t("nav.learn_more")}
                  <ArrowRight className="flip-rtl size-4 transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5" aria-hidden />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Impact Stats ---------- */}
      <StatsShowcase items={stats} />

      <Q3Section c={c} />

      {/* ---------- Gallery strip ---------- */}
      <GalleryMarquee c={c} />

      <CtaBand c={c} />
    </>
  );
}
