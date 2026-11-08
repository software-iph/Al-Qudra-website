import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/Blocks";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/gallery">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "معرض الصور" : "Gallery" };
}

export default async function GalleryPage({ params }: PageProps<"/[lang]/gallery">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);

  return (
    <>
      <PageHero c={c} title={c.t("gallery.title")} intro={c.t("gallery.intro")} image={c.media("gallery.hero_image")} />
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <GalleryGrid items={c.gallery} rtl={lang === "ar"} />
        </div>
      </section>
    </>
  );
}
