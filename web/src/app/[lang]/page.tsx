import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/site/Blocks";
import { ChapterGrid, ChapterIndex, DataSheet, Figure, RailLabel } from "@/components/site/Chapter";
import { Coverflow } from "@/components/site/Coverflow";
import { GoldenSquareHero } from "@/components/site/GoldenSquareHero";
import { Reveal, SplitText } from "@/components/site/Motion";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

/*
 * Home, deliberately short: 1 3D hero · 2 profile (who we are + figures, in the hero's navy) · 3 inside ALQUDRA (3D coverflow) · 4 contact.
 * After the hero the page reads as one "site record": every chapter shares the index-rail grid in Chapter.tsx.
 * The full story, services, mission & vision, values and Q³ live on the About page.
 */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);
  const ar = lang === "ar";

  return (
    <>
      {/* 1. Hero: the scroll story around Golden Square */}
      <GoldenSquareHero
        rtl={ar}
        eyebrow={c.t("home.hero_eyebrow")}
        title={c.t("home.hero_title")}
        text={c.t("home.hero_text")}
        primary={{ label: c.t("home.hero_primary"), href: `/${lang}/about#services` }}
        secondary={{ label: c.t("home.hero_secondary"), href: `/${lang}/contact` }}
        scenes={[
          { kicker: c.t("hero.scene2_kicker"), title: c.t("hero.scene2_title"), text: c.t("hero.scene2_text") },
          { kicker: c.t("hero.scene3_kicker"), title: c.t("hero.scene3_title"), text: c.t("hero.scene3_text") },
          { kicker: c.t("hero.scene4_kicker"), title: c.t("hero.scene4_title"), text: c.t("hero.scene4_text") },
        ]}
        finalButton={{ label: c.t("hero.scene4_button"), href: `/${lang}/contact` }}
        floorLabel={c.t("hero.floor_label")}
        modelNote={c.t("hero.model_note")}
        scrollLabel={c.t("nav.scroll")}
        poster="/images/hero-3d.jpg" // fixed: the 3D scroll story is not edited from the dashboard (texts are)
        model="/hero/golden-square.glb"
      />

      {/* 2. Profile — continues the hero's navy world: who we are, then the figures as evidence */}
      <section className="on-dark relative isolate overflow-hidden bg-navy-900 pt-28 pb-28 text-white sm:pt-36 sm:pb-36">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-60 bg-[linear-gradient(180deg,rgb(8_21_33),transparent)]" aria-hidden />
        <ChapterGrid rail={<ChapterIndex n={1} label={c.t("home.about_eyebrow")} light />}>
          <div className="grid gap-12 md:grid-cols-12 md:gap-x-12">
            <div className="md:col-span-7">
              <SplitText text={c.t("home.about_title")} className="heading !text-white" />
              <Reveal delay={0.08} className="mt-10 max-w-xl md:mt-14">
                <p className="text-lg leading-[1.75] text-white/72">{c.t("home.about_text")}</p>
                <Link href={`/${lang}/about`} className="group mt-9 inline-flex items-center gap-3 border-b border-white/30 pb-1.5 text-[13px] font-bold tracking-[0.12em] text-white uppercase transition-colors duration-[160ms] hover:border-white rtl:tracking-normal rtl:normal-case">
                  {c.t("nav.learn_more")}
                  <ArrowRight className="flip-rtl size-4 transition-transform duration-[220ms] group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                </Link>
              </Reveal>
            </div>
            <Figure src={c.media("home.about_image")} caption={c.t("home.about_caption")} className="md:col-span-4 md:col-start-9" square />
          </div>
        </ChapterGrid>

        <ChapterGrid
          className="mt-16 sm:mt-20"
          rail={
            <RailLabel light>
              {c.t("home.numbers_eyebrow")}
            </RailLabel>
          }
        >
          <DataSheet items={c.items("stats").slice(0, 3).map((s) => ({ id: s.id, value: s.body, label: s.title }))} />
        </ChapterGrid>
      </section>

      {/* 3. Inside ALQUDRA — the restored 3D coverflow of real team photos */}
      {c.gallery.length > 0 && (
        <section className="relative overflow-hidden py-28 sm:py-36">
          <ChapterGrid rail={<ChapterIndex n={2} label={c.t("nav.gallery")} />}>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <SplitText text={c.t("home.gallery_title")} className="heading max-w-[16ch]" />
              <Link href={`/${lang}/gallery`} className="btn-outline">
                {c.t("nav.view_all")} <span dir="ltr">({c.gallery.length})</span>
                <ArrowUpRight className="flip-rtl size-4" aria-hidden />
              </Link>
            </div>
          </ChapterGrid>
          <div className="container-x mt-16 sm:mt-24">
            <Coverflow
              slides={c.gallery.slice(0, 12)}
              backdrop={c.t("home.gallery_eyebrow")}
              fallbackCaption={c.t("home.gallery_eyebrow")}
              rtl={ar}
              labels={{ prev: c.t("nav.previous"), next: c.t("nav.next"), pause: c.t("nav.pause"), play: c.t("nav.play") }}
            />
          </div>
        </section>
      )}

      {/* 4. Next step */}
      <CtaBand c={c} />
    </>
  );
}
