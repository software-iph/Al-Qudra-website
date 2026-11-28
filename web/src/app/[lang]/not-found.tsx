import Link from "next/link";
import { BrandSymbol } from "@/components/site/Brand";

/**
 * Friendly dead end (IPH B4), in both languages and inside the site's own header and footer.
 * The Q symbol stands in for the zero of "404", so even this page carries the brand.
 */
export default function NotFound() {
  return (
    <section className="on-dark relative isolate overflow-hidden bg-navy-900 pt-40 pb-28 text-white sm:pt-48 sm:pb-36">
      <div className="blueprint pointer-events-none absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-x-12">
        <p className="label-mono flex items-center gap-4 text-white/60 lg:col-span-3 lg:pt-6" dir="ltr">
          <span className="h-px w-10 bg-white/35" aria-hidden />
          Error 404
        </p>
        <div className="lg:col-span-9">
          <p className="flex items-center font-display text-[clamp(6rem,17vw,13rem)] leading-none font-bold tracking-[-0.06em]" dir="ltr" aria-label="404">
            <span aria-hidden>4</span>
            <BrandSymbol className="mx-[0.04em] h-[0.74em] w-auto text-patina-400" />
            <span aria-hidden>4</span>
          </p>
          <div className="mt-12 grid gap-6 border-t border-white/15 pt-8 md:grid-cols-2 md:gap-12">
            <div lang="en" dir="ltr">
              <h1 className="text-2xl font-bold sm:text-3xl">This page is not here.</h1>
              <p className="mt-3 leading-relaxed text-white/65">The address may have changed. These links lead back to the site.</p>
            </div>
            <div lang="ar" dir="rtl">
              <p className="text-2xl font-bold sm:text-3xl">هذه الصفحة غير موجودة.</p>
              <p className="mt-3 leading-relaxed text-white/65">ربما تغيّر العنوان. هذه الروابط تعيدك إلى الموقع.</p>
            </div>
          </div>
          <nav className="mt-10 flex flex-wrap gap-3" aria-label="Main sections">
            <Link href="/en" className="btn-light" lang="en">
              Home
            </Link>
            <Link href="/en/about" className="btn-ghost" lang="en">
              About us
            </Link>
            <Link href="/en/contact" className="btn-ghost" lang="en">
              Contact
            </Link>
            <Link href="/ar" className="btn-ghost" lang="ar" dir="rtl">
              الرئيسية
            </Link>
          </nav>
        </div>
      </div>
    </section>
  );
}
