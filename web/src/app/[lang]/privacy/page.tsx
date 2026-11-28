import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/Blocks";
import { RailLabel } from "@/components/site/Chapter";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = await getContent(lang);
  return { title: c.t("privacy.title"), description: c.t("privacy.intro") };
}

/** Privacy policy (IPH C5). Edited in the dashboard: Texts → Privacy policy (lines starting with ## are headings). */
export default async function PrivacyPage({
  params,
}: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);
  const blocks = c.list("privacy.body");
  const email = c.setting("email");
  const headings = blocks.flatMap((line, i) =>
    line.startsWith("##")
      ? [{ id: `s-${i}`, text: line.replace(/^#+\s*/, "") }]
      : [],
  );

  return (
    <>
      <PageHero
        kicker={c.t("privacy.updated")}
        title={c.t("privacy.title")}
        intro={c.t("privacy.intro")}
      />
      <section className="py-24 sm:py-32">
        {/* A legal page is read, not browsed: the side column earns its place as a sticky table of contents. */}
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-x-16">
          <div className="lg:col-span-3">
            {headings.length > 1 && (
              <nav
                aria-label={c.t("privacy.title")}
                className="lg:sticky lg:top-28"
              >
                <RailLabel>{c.t("privacy.title")}</RailLabel>
                <ol className="mt-6 grid gap-1 border-s border-navy-800/15">
                  {headings.map((h) => (
                    <li key={h.id}>
                      <a
                        href={`#${h.id}`}
                        className="-ms-px block border-s border-transparent py-1.5 ps-4 text-sm text-muted transition-colors duration-[160ms] hover:border-navy-800 hover:text-ink"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>
          <div className="lg:col-span-8 lg:col-start-5">
            <article className="max-w-3xl">
              {blocks.map((line, i) =>
                line.startsWith("##") ? (
                  <h2
                    key={i}
                    id={`s-${i}`}
                    className="title mt-14 scroll-mt-28 border-t border-navy-800/15 pt-8 text-ink first:mt-0 first:border-t-0 first:pt-0"
                  >
                    {line.replace(/^#+\s*/, "")}
                  </h2>
                ) : (
                  <p
                    key={i}
                    className="mt-4 text-[1.0625rem] leading-[1.75] text-muted"
                  >
                    {line}
                  </p>
                ),
              )}
              {email && (
                <p className="mt-14 border-t border-navy-800/15 pt-8 text-[1.0625rem] text-ink">
                  <a
                    href={`mailto:${email}`}
                    className="font-bold text-navy-800 underline decoration-navy-800/25 underline-offset-[6px] transition-colors hover:decoration-navy-800"
                    dir="ltr"
                  >
                    {email}
                  </a>
                </p>
              )}
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
