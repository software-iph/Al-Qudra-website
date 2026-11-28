import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand, PageHero } from "@/components/site/Blocks";
import { ChapterGrid, ChapterIndex } from "@/components/site/Chapter";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { SplitText } from "@/components/site/Motion";
import { VideoFeature } from "@/components/site/VideoFeature";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/gallery">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = await getContent(lang);
  return { title: c.t("gallery.title"), description: c.t("gallery.intro") };
}

export default async function GalleryPage({ params }: PageProps<"/[lang]/gallery">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);

  return (
    <>
      <PageHero kicker={c.t("home.gallery_eyebrow")} title={c.t("gallery.title")} intro={c.t("gallery.intro")} image={c.media("gallery.hero_image")} />
      {/* The film from site opens the gallery (moved here from About to keep that page short) */}
      <VideoFeature
        src={c.media("services.video")}
        eyebrow={c.t("services.video_eyebrow")}
        title={c.t("services.video_title")}
        text={c.t("services.video_text")}
        labels={{ play: c.t("services.video_play"), pause: c.t("services.video_pause") }}
      />

      {/* 01 · The team at work — a short header on the chapter grid, then the photo wall at full width */}
      <section className="py-24 sm:py-32">
        <ChapterGrid
          rail={
            <ChapterIndex
              n={1}
              label={c.t("home.gallery_eyebrow")}
              aside={
                <>
                  <bdi dir="ltr">{c.gallery.length}</bdi> {c.t("home.gallery_photos")}
                </>
              }
            />
          }
        >
          <SplitText text={c.t("home.gallery_title")} className="heading max-w-[16ch]" />
        </ChapterGrid>
        <div className="container-x mt-16 sm:mt-20">
          <GalleryGrid items={c.gallery} rtl={lang === "ar"} />
        </div>
      </section>
      <CtaBand c={c} />
    </>
  );
}
