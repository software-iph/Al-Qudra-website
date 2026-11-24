import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, Q3Section, StatsShowcase } from "@/components/site/Blocks";
import { GalleryMarquee } from "@/components/site/GalleryMarquee";
import { Arc, HeroParallax, Reveal, RevealImage, ScrollCue, SplitText, Tiles } from "@/components/site/Motion";
import { SmartVideo } from "@/components/site/SmartVideo";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);
  const stats = c.items("stats");

  return (
    <>
      {/* ---------- Hero: ink, the site film behind an ink gradient from the text side, the Arc ---------- */}
      <HeroParallax
        className="relative isolate flex min-h-[min(100svh,60rem)] items-end overflow-hidden bg-navy-900 pt-36 pb-12 text-paper"
        background={
          <>
            <SmartVideo src={c.media("home.hero_video")} poster={c.media("home.hero_poster")} eager className="aq-hero-video photo size-full object-cover opacity-75" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/70 to-navy-900/0 rtl:bg-gradient-to-l" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-900 to-transparent" aria-hidden />
          </>
        }
      >
        <Arc className="-end-64 -bottom-[28rem] size-[56rem] sm:-end-40" tone="text-paper/[0.08]" />
        <div className="container-x">
          <div className="max-w-5xl">
            <Reveal onMount delay={0.15} y={8}>
              <p className="label-mono text-paper/70">{c.t("home.hero_eyebrow")}</p>
            </Reveal>
            <SplitText as="h1" onMount delay={0.3} text={c.t("home.hero_title")} className="display mt-6" />
            <Reveal onMount delay={0.75}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-paper/80 sm:text-xl">{c.t("home.hero_text")}</p>
            </Reveal>
            <Reveal onMount delay={0.95}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={`/${lang}/about#services`} className="btn-light px-7 py-4 text-base">
                  {c.t("home.hero_primary")}
                  <ArrowRight className="flip-rtl size-5" aria-hidden />
                </Link>
                <Link href={`/${lang}/contact`} className="btn-ghost px-7 py-4 text-base">
                  {c.t("home.hero_secondary")}
                </Link>
              </div>
            </Reveal>
          </div>

          <div className="mt-14 hidden justify-center lg:flex">
            <ScrollCue label={c.t("nav.scroll")} delay={1.4} />
          </div>
        </div>
      </HeroParallax>

      {/* ---------- Who we are: the photos lead ---------- */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="relative pb-24 sm:pb-32 lg:col-span-7 lg:pb-0">
            <RevealImage src={c.media("home.about_image")} className="aspect-[4/5] w-10/12 sm:aspect-[5/6] lg:w-9/12" />
            <RevealImage
              src={c.media("home.about_image_2")}
              delay={0.2}
              className="absolute end-0 bottom-0 aspect-[4/5] w-6/12 border-[10px] border-paper lg:-bottom-12 lg:w-5/12"
            />
          </div>

          <div className="lg:col-span-5">
            <Tiles className="mb-8" />
            <SplitText text={c.t("home.about_title")} className="heading" />
            <Reveal delay={0.2}>
              <p className="lead mt-6 max-w-md">{c.t("home.about_text")}</p>
              <Link href={`/${lang}/about`} className="btn-primary mt-10 px-8 py-4 text-base">
                {c.t("nav.learn_more")}
                <ArrowRight className="flip-rtl size-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Headline numbers ---------- */}
      <StatsShowcase items={stats} />

      <Q3Section c={c} />

      {/* ---------- Inside ALQUDRA ---------- */}
      <GalleryMarquee c={c} />

      <CtaBand c={c} />
    </>
  );
}
