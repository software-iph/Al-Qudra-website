import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatsShowcase } from "@/components/site/Blocks";
import { CinematicHero, ParallaxPhoto, RingReveal, ScrollWords, ServicesReel, StackedPillars } from "@/components/site/Cinematic";
import { GalleryMarquee } from "@/components/site/GalleryMarquee";
import { Arc, Reveal, ScrollCue, SplitText, Tiles } from "@/components/site/Motion";
import { SmartVideo } from "@/components/site/SmartVideo";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);

  return (
    <>
      {/* 1. The film pulls back into a framed shot as you scroll */}
      <CinematicHero
        media={<SmartVideo src={c.media("home.hero_video")} poster={c.media("home.hero_poster")} eager className="aq-hero-video photo size-full object-cover opacity-80" />}
        overlay={
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/55 to-navy-900/0 rtl:bg-gradient-to-l" aria-hidden />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-900/90 to-transparent" aria-hidden />
            <Arc className="-end-64 -bottom-[28rem] size-[56rem] sm:-end-40" tone="text-paper/[0.08]" />
          </>
        }
      >
        <div className="container-x">
          <div className="max-w-5xl">
            <Reveal onMount delay={0.15} y={8}>
              <p className="label-mono text-paper/75">{c.t("home.hero_eyebrow")}</p>
            </Reveal>
            <SplitText as="h1" onMount delay={0.3} text={c.t("home.hero_title")} className="display mt-6" />
            <Reveal onMount delay={0.8}>
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
            <ScrollCue label={c.t("nav.scroll")} delay={1.2} />
          </div>
        </div>
      </CinematicHero>

      {/* 2. One statement, lit word by word, between two drifting photos */}
      <section className="relative overflow-hidden py-28 sm:py-40">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12">
          <ParallaxPhoto src={c.media("home.about_image")} speed={10} className="aspect-[3/4] lg:col-span-4" />
          <div className="lg:col-span-8 lg:ps-10">
            <Tiles className="mb-10" />
            <ScrollWords
              text={c.t("home.about_title")}
              className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-ink sm:text-6xl lg:text-7xl rtl:leading-[1.35] rtl:tracking-normal"
            />
            <Reveal delay={0.1}>
              <Link href={`/${lang}/about`} className="btn-primary mt-12 px-8 py-4 text-base">
                {c.t("nav.learn_more")}
                <ArrowRight className="flip-rtl size-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </div>
        <ParallaxPhoto src={c.media("home.about_image_2")} speed={22} className="absolute -end-10 bottom-10 hidden aspect-square w-56 border-[10px] border-paper xl:block" />
      </section>

      {/* 3. Headline numbers */}
      <StatsShowcase items={c.items("stats")} />

      {/* 4. Services slide past sideways while you scroll */}
      <ServicesReel
        rtl={lang === "ar"}
        items={c.services.map((s) => ({ id: s.id, title: s.title, image: s.image, href: `/${lang}/about#service-${s.id}` }))}
        intro={
          <div>
            <SplitText text={c.t("services.title")} className="display !text-paper" />
            <Link href={`/${lang}/about#services`} className="btn-ghost mt-10">
              {c.t("nav.learn_more")}
              <ArrowRight className="flip-rtl size-4" aria-hidden />
            </Link>
          </div>
        }
      />

      {/* 5. The Q³ pillars stack like sheets */}
      <StackedPillars
        items={c.items("q3").map((p) => ({ id: p.id, title: p.title, body: p.body }))}
        heading={<SplitText text={c.t("home.q3_title")} className="display" />}
      />

      {/* 6. Inside ALQUDRA */}
      <GalleryMarquee c={c} />

      {/* 7. A photo opens out of the Q ring */}
      <RingReveal src={c.media("home.cta_image")}>
        <div className="container-x grid items-end gap-10 lg:grid-cols-[1fr_auto]">
          <h2 className="display max-w-3xl">{c.t("home.cta_title")}</h2>
          <Link href={`/${lang}/contact`} className="btn-accent px-8 py-4 text-base">
            {c.t("home.cta_button")}
            <ArrowUpRight className="flip-rtl size-5" aria-hidden />
          </Link>
        </div>
      </RingReveal>
    </>
  );
}
