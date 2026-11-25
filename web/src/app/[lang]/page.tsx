import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatsShowcase } from "@/components/site/Blocks";
import { RingReveal, ServicesReel, StackedPillars, StatementCollage } from "@/components/site/Cinematic";
import { GalleryMarquee } from "@/components/site/GalleryMarquee";
import { Reveal, SplitText, Tiles } from "@/components/site/Motion";
import { SmartVideo } from "@/components/site/SmartVideo";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);

  return (
    <>
      {/* 1. Hero: the site film, still and simple (no entrance or scroll animation) */}
      <section className="relative isolate flex min-h-[min(100svh,60rem)] items-end overflow-hidden bg-navy-900 pt-36 pb-16 text-paper">
        <div className="absolute inset-0 -z-10">
          <SmartVideo src={c.media("home.hero_video")} poster={c.media("home.hero_poster")} eager className="photo size-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/55 to-navy-900/0 rtl:bg-gradient-to-l" aria-hidden />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-900/90 to-transparent" aria-hidden />
          {/* The Arc, cropped by the frame */}
          <svg viewBox="0 0 100 100" className="absolute -end-64 -bottom-[28rem] size-[56rem] text-paper/[0.08] sm:-end-40" aria-hidden>
            <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="6" />
          </svg>
        </div>
        <div className="container-x">
          <div className="max-w-5xl">
            <p className="label-mono text-paper/75">{c.t("home.hero_eyebrow")}</p>
            <h1 className="display mt-6">{c.t("home.hero_title")}</h1>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href={`/${lang}/about#services`} className="btn-light px-7 py-4 text-base">
                {c.t("home.hero_primary")}
                <ArrowRight className="flip-rtl size-5" aria-hidden />
              </Link>
              <Link href={`/${lang}/contact`} className="btn-ghost px-7 py-4 text-base">
                {c.t("home.hero_secondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. One statement, lit word by word, with photos drifting past at different depths */}
      <StatementCollage
        text={c.t("home.about_title")}
        photos={[c.media("home.about_image"), ...c.gallery.slice(0, 1).map((g) => g.src), c.media("home.about_image_2")]}
      >
        <Tiles className="mt-12" />
        <Reveal delay={0.1}>
          <Link href={`/${lang}/about`} className="btn-primary mt-10 px-8 py-4 text-base">
            {c.t("nav.learn_more")}
            <ArrowRight className="flip-rtl size-4" aria-hidden />
          </Link>
        </Reveal>
      </StatementCollage>

      {/* 3. Headline numbers */}
      <StatsShowcase items={c.items("stats")} />

      {/* 4. Services slide past sideways while you scroll */}
      <ServicesReel
        rtl={lang === "ar"}
        items={c.services.map((s) => ({ id: s.id, title: s.title, image: s.image, href: `/${lang}/about#service-${s.id}` }))}
        intro={
          <div>
            <SplitText text={c.t("services.title")} className="heading !text-paper" />
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
