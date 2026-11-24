import { ArrowRight, Images } from "lucide-react";
import Link from "next/link";
import type { Content } from "@/lib/content";
import { Coverflow } from "./Coverflow";
import { Reveal, SplitText } from "./Motion";

/** "Inside Al-Qudra": 3D coverflow carousel of the gallery photos. */
export function GalleryMarquee({ c }: { c: Content }) {
  const photos = c.gallery.slice(0, 15);
  if (photos.length === 0) return null;
  const href = `/${c.lang}/gallery`;

  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-limestone/50 py-24 sm:py-32">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <SplitText text={c.t("home.gallery_title")} className="heading" />
        </div>
      </div>

      <Reveal delay={0.1} className="mt-14 sm:mt-20">
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
        <span className="label-mono inline-flex items-center gap-2 text-concrete">
          <Images className="size-4 text-navy-700" strokeWidth={1.25} aria-hidden />
          <span dir="ltr">{c.gallery.length}</span> {c.t("home.gallery_photos")}
        </span>
      </Reveal>
    </section>
  );
}
