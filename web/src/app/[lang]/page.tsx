import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CtaBand, Q3Section, StatsShowcase } from "@/components/site/Blocks";
import { GalleryMarquee } from "@/components/site/GalleryMarquee";
import { HeroParallax, RevealImage, Reveal, ScrollCue, SplitText } from "@/components/site/Motion";
import { SmartVideo } from "@/components/site/SmartVideo";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

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
            <SplitText
              as="h1"
              onMount
              delay={0.35}
              duration={1.1}
              stagger={0.06}
              text={c.t("home.hero_title")}
              className="text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-6xl lg:text-7xl rtl:leading-[1.3] rtl:tracking-normal"
            />
            <Reveal onMount delay={0.9} duration={1.1}>
              <p className="mt-6 max-w-xl text-lg sm:text-xl leading-relaxed text-white/80">{c.t("home.hero_text")}</p>
            </Reveal>
            <Reveal onMount delay={1.15} duration={1}>
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
            <ScrollCue label={c.t("nav.scroll")} delay={1.6} />
          </div>
        </div>
      </HeroParallax>

      {/* ---------- Who we are: photos lead, a few words follow ---------- */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="relative pb-24 sm:pb-32 lg:col-span-7 lg:pb-0">
            <RevealImage src={c.media("home.about_image")} className="aspect-[4/5] w-10/12 rounded-[2rem] sm:aspect-[5/6] lg:w-9/12" />
            <RevealImage
              src={c.media("home.about_image_2")}
              delay={0.25}
              drift={12}
              className="absolute end-0 bottom-0 aspect-[4/5] w-6/12 rounded-[2rem] shadow-[0_30px_60px_-20px_rgb(7_19_34/0.45)] ring-8 ring-white lg:-bottom-12 lg:w-5/12"
            />
          </div>

          <div className="lg:col-span-5">
            <SplitText text={c.t("home.about_title")} className="heading" />
            <Reveal delay={0.2}>
              <p className="lead mt-6 max-w-md">{c.t("home.about_text")}</p>
              <Link href={`/${lang}/about`} className="btn-primary group mt-10 px-8 py-4 text-base">
                {c.t("nav.learn_more")}
                <ArrowRight className="flip-rtl size-4 transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5" aria-hidden />
              </Link>
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
