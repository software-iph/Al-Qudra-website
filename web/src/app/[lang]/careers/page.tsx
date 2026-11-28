import { and, asc, desc, eq, gte, isNull, or, sql } from "drizzle-orm";
import { ArrowUpRight, Building2, CalendarClock, Clock, HardHat, Layers, Mail, MapPin, Shuffle, Wifi } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/Blocks";
import { ChapterGrid, ChapterIndex } from "@/components/site/Chapter";
import { JobApply } from "@/components/site/JobApply";
import { Reveal, SplitText } from "@/components/site/Motion";
import { getContent } from "@/lib/content";
import { db, schema } from "@/lib/db";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/careers">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = await getContent(lang);
  return { title: c.t("careers.title"), description: c.t("careers.intro") };
}

export default async function CareersPage({ params }: PageProps<"/[lang]/careers">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);
  const ar = lang === "ar";
  // Open jobs only; a job closes by itself the day after its deadline.
  const jobs = await db
    .select()
    .from(schema.careers)
    .where(and(eq(schema.careers.active, true), or(isNull(schema.careers.deadline), gte(schema.careers.deadline, sql`current_date`))))
    .orderBy(desc(schema.careers.createdAt), asc(schema.careers.id));
  const email = c.setting("careers_email") || c.setting("email");
  const formLabels = {
    name: c.t("careers.form_name"),
    email: c.t("careers.form_email"),
    phone: c.t("careers.form_phone"),
    city: c.t("careers.form_city"),
    link: c.t("careers.form_link"),
    cv: c.t("careers.form_cv"),
    cv_pick: c.t("careers.form_cv_pick"),
    message: c.t("careers.form_message"),
    submit: c.t("careers.form_submit"),
    sending: c.t("careers.form_sending"),
    success: c.t("careers.form_success"),
    cv_invalid: c.t("careers.form_cv_invalid"),
    close: c.t("careers.form_close"),
    invalid: c.t("forms.invalid"),
    error: c.t("forms.error"),
    busy: c.t("forms.busy"),
    consent: c.t("forms.consent_careers"),
    consentLink: c.t("forms.consent_link"),
    consentMissing: c.t("forms.consent_missing"),
    privacyHref: `/${lang}/privacy`,
  };
  const openApplication = (variant: "primary" | "outline") => (
    <JobApply jobId={0} jobTitle={c.t("careers.open_application_title")} heading={c.t("careers.title")} button={c.t("careers.open_application")} variant={variant} labels={formLabels} />
  );
  const dateFmt = new Intl.DateTimeFormat(ar ? "ar-LY-u-nu-latn" : "en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <>
      <PageHero kicker={c.t("nav.careers")} title={c.t("careers.title")} intro={c.t("careers.intro")} image={c.media("careers.hero_image")} />

      {/* 01 · Current openings — each job a row on the hairline grid; the open application closes the page */}
      <section id="openings" className="scroll-mt-24 py-24 sm:py-32">
        <ChapterGrid
          rail={<ChapterIndex n={1} label={c.t("nav.careers")} aside={jobs.length > 0 ? <bdi dir="ltr">{String(jobs.length).padStart(2, "0")}</bdi> : undefined} />}
        >
          <SplitText text={c.t("careers.openings_title")} className="heading" />

          <div className="mt-12 border-t border-navy-800/15">
            {jobs.length === 0 && (
              <Reveal>
                <div className="flex flex-col items-start gap-6 border-b border-navy-800/15 py-10 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-lg leading-relaxed text-muted">{c.t("careers.empty")}</p>
                  {openApplication("primary")}
                </div>
              </Reveal>
            )}

            {jobs.map((job, i) => {
              const title = ar && job.titleAr ? job.titleAr : job.titleEn;
              const description = ar && job.descriptionAr ? job.descriptionAr : job.descriptionEn;
              const department = ar && job.departmentAr ? job.departmentAr : job.departmentEn;
              return (
                <Reveal key={job.id} delay={Math.min(i, 5) * 0.04}>
                  <article className="grid gap-6 border-b border-navy-800/15 py-10 lg:grid-cols-[3rem_1fr_auto] lg:items-start lg:gap-8">
                    <span className="font-bold text-navy-800/40 tabular-nums max-lg:hidden" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="max-w-3xl">
                      <h3 className="title text-ink">{title}</h3>
                      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                        {department && (
                          <li className="inline-flex items-center gap-1.5">
                            <Layers className="size-4 text-navy-800/55" strokeWidth={1.5} aria-hidden />
                            <span className="sr-only">{c.t("careers.department")}: </span>
                            {department}
                          </li>
                        )}
                        <li className="inline-flex items-center gap-1.5">
                          <Clock className="size-4 text-navy-800/55" strokeWidth={1.5} aria-hidden /> {c.t(`careers.${job.employment}`)}
                        </li>
                        <li className="inline-flex items-center gap-1.5">
                          <LocationIcon location={job.location} /> {c.t(`careers.${job.location}`)}
                        </li>
                        {job.city && (
                          <li className="inline-flex items-center gap-1.5">
                            <MapPin className="size-4 text-navy-800/55" strokeWidth={1.5} aria-hidden /> {job.city}
                          </li>
                        )}
                        {job.deadline && (
                          <li className="inline-flex items-center gap-1.5 font-bold text-navy-800">
                            <CalendarClock className="size-4" strokeWidth={1.5} aria-hidden />
                            {c.t("careers.deadline")}: {dateFmt.format(new Date(`${job.deadline}T12:00:00`))}
                          </li>
                        )}
                      </ul>
                      {description && <p className="mt-5 leading-relaxed whitespace-pre-line text-muted">{description}</p>}
                    </div>
                    {job.applyMethod === "link" && job.applyUrl ? (
                      <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0 justify-self-start">
                        {c.t("careers.apply_now")}
                        <ArrowUpRight className="flip-rtl size-4" aria-hidden />
                      </a>
                    ) : (
                      <div className="justify-self-start">
                        <JobApply jobId={job.id} jobTitle={title} heading={c.t("careers.form_title")} button={c.t("careers.apply_now")} labels={formLabels} />
                      </div>
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              {jobs.length > 0 && openApplication("outline")}
              {email && (
                <p className="text-muted">
                  {c.t("careers.send_cv")}{" "}
                  <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 font-bold text-navy-800 underline decoration-navy-800/25 underline-offset-[6px] transition-colors hover:decoration-navy-800" dir="ltr">
                    <Mail className="size-4" aria-hidden />
                    {email}
                  </a>
                </p>
              )}
            </div>
          </Reveal>
        </ChapterGrid>
      </section>

    </>
  );
}

function LocationIcon({ location }: { location: string }) {
  const Icon = location === "on_site" ? HardHat : location === "hybrid" ? Shuffle : location === "remote" ? Wifi : Building2;
  return <Icon className="size-4 text-navy-800/55" strokeWidth={1.5} aria-hidden />;
}
