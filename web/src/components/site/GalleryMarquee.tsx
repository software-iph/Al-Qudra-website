import { ArrowRight, Images } from "lucide-react";
import Link from "next/link";
import type { Content } from "@/lib/content";
import { Coverflow } from "./Coverflow";
import { Reveal } from "./Motion";

/** "Inside Al-Qudra": 3D coverflow carousel of the gallery photos. */
export function GalleryMarquee({ c }: { c: Content }) {
  const photos = c.gallery.slice(0, 15);
  if (photos.length === 0) return null;
  const href = `/${c.lang}/gallery`;

  return (
    <section className="relative isolate overflow-hidden bg-paper py-24 sm:py-32">
      <div className="absolute -top-40 start-1/4 -z-10 size-[520px] rounded-full bg-sky-soft blur-[110px]" aria-hidden />

      <div className="container-x">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">{c.t("home.gallery_eyebrow")}</p>
          <h2 className="heading mt-4">{c.t("home.gallery_title")}</h2>
          <p className="lead mt-5">{c.t("home.gallery_text")}</p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-20 sm:mt-28">
        <Coverflow
          slides={photos}
          backdrop={c.t("home.gallery_eyebrow")}
          fallbackCaption={c.t("home.gallery_eyebrow")}
          rtl={c.lang === "ar"}
        />
      </Reveal>

      <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-4">
        <Link href={href} className="btn-primary">
          {c.t("nav.view_all")}
          <ArrowRight className="flip-rtl size-4" aria-hidden />
        </Link>
        <span className="inline-flex items-center gap-2 text-sm font-bold text-muted">
          <Images className="size-4 text-navy-500" aria-hidden />
          <span dir="ltr">{c.gallery.length}</span> {c.t("home.gallery_photos")}
        </span>
      </Reveal>
    </section>
  );
}
