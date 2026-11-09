import { asc, desc, eq } from "drizzle-orm";
import { ArrowUpRight, Briefcase, Building2, Clock, HardHat, Mail, MapPin, Shuffle, Wifi } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardGrid, PageHero, SectionHeading } from "@/components/site/Blocks";
import { JobApply } from "@/components/site/JobApply";
import { Reveal } from "@/components/site/Motion";
import { getContent } from "@/lib/content";
import { db, schema } from "@/lib/db";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/careers">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "الوظائف" : "Careers" };
}

export default async function CareersPage({ params }: PageProps<"/[lang]/careers">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);
  const ar = lang === "ar";
  const jobs = await db
    .select()
    .from(schema.careers)
    .where(eq(schema.careers.active, true))
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
  };
  const openApplication = (variant: "primary" | "outline") => (
    <JobApply
      jobId={0}
      jobTitle={c.t("careers.open_application_title")}
      heading={c.t("careers.title")}
      button={c.t("careers.open_application")}
      variant={variant}
      labels={formLabels}
    />
  );

  return (
    <>
      <PageHero c={c} title={c.t("careers.title")} intro={c.t("careers.intro")} image={c.media("careers.hero_image")} />

      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading title={c.t("careers.openings_title")} />

          <div className="mt-12 grid gap-5">
            {jobs.length === 0 && (
              <Reveal>
                <div className="flex flex-col items-start gap-6 rounded-3xl border border-dashed border-navy-700/20 bg-paper p-10 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-5">
                    <div className="icon-tile size-14">
                      <Briefcase className="size-7" strokeWidth={1.5} />
                    </div>
                    <p className="max-w-xl text-lg leading-8 text-muted">{c.t("careers.empty")}</p>
                  </div>
                  {openApplication("primary")}
                </div>
              </Reveal>
            )}

            {jobs.map((job, i) => {
              const title = ar && job.titleAr ? job.titleAr : job.titleEn;
              const description = ar && job.descriptionAr ? job.descriptionAr : job.descriptionEn;
              return (
                <Reveal key={job.id} delay={Math.min(i, 4) * 0.05}>
                  <article className="card flex flex-col gap-6 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-3xl">
                      <h3 className="text-2xl font-extrabold text-navy-900">{title}</h3>
                      <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-3 py-1.5 text-navy-700">
                          <Clock className="size-4" /> {c.t(`careers.${job.employment}`)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-navy-800">
                          <LocationIcon location={job.location} /> {c.t(`careers.${job.location}`)}
                        </span>
                        {job.city && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-3 py-1.5 text-navy-800">
                            <MapPin className="size-4" /> {job.city}
                          </span>
                        )}
                      </div>
                      {description && <p className="mt-5 leading-8 whitespace-pre-line text-muted">{description}</p>}
                    </div>
                    {job.applyMethod === "link" && job.applyUrl ? (
                      <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">
                        {c.t("careers.apply_now")}
                        <ArrowUpRight className="flip-rtl size-4" aria-hidden />
                      </a>
                    ) : (
                      <JobApply jobId={job.id} jobTitle={title} heading={c.t("careers.form_title")} button={c.t("careers.apply_now")} labels={formLabels} />
                    )}
                  </article>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            {jobs.length > 0 && openApplication("outline")}
            {email && (
              <p className="text-muted">
                {c.t("careers.send_cv")}{" "}
                <a href={`mailto:${email}`} className="font-bold text-navy-700 underline underline-offset-4" dir="ltr">
                  <Mail className="me-1 inline size-4" />
                  {email}
                </a>
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-paper py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading center eyebrow={c.t("about.values_title")} title={c.t("about.values_title")} text={c.t("about.values_text")} />
          <div className="mt-14">
            <CardGrid items={c.items("values").slice(0, 4)} />
          </div>
        </div>
      </section>
    </>
  );
}

function LocationIcon({ location }: { location: string }) {
  const Icon = location === "on_site" ? HardHat : location === "hybrid" ? Shuffle : location === "remote" ? Wifi : Building2;
  return <Icon className="size-4" />;
}
