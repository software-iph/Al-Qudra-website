import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand, PageHero, SectionHeading } from "@/components/site/Blocks";
import { Icon } from "@/components/site/Icon";
import { Reveal, RevealImage } from "@/components/site/Motion";
import { VideoFeature } from "@/components/site/VideoFeature";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "خدماتنا" : "Services" };
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);
  const steps = c.list("services.process").map((line) => {
    const [title, ...rest] = line.split(":");
    return rest.length ? { title: title.trim(), text: rest.join(":").trim() } : { title: line, text: "" };
  });
  const video = c.media("services.video");

  return (
    <>
      <PageHero c={c} title={c.t("services.title")} intro={c.t("services.intro")} image={c.media("services.hero_image")} />

      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-24 sm:gap-32">
          {c.services.map((s, i) => (
            <article key={s.id} id={`service-${s.id}`} className="grid scroll-mt-28 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <Reveal className={i % 2 ? "lg:order-2" : ""}>
                <div className="relative overflow-hidden rounded-[2rem]">
                  <RevealImage src={s.image} className="aspect-[4/3]" />
                  <span className="absolute top-6 start-6 rounded-full bg-white/95 px-4 py-2 text-sm font-extrabold text-navy-700" dir="ltr">
                    0{i + 1}
                  </span>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="icon-tile size-14">
                  <Icon name={s.icon} className="size-7" />
                </div>
                <h2 className="heading mt-6 !text-3xl sm:!text-4xl">{s.title}</h2>
                <p className="lead mt-5">{s.summary}</p>
                {s.points.length > 0 && (
                  <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-3 rounded-2xl bg-paper p-4 font-bold text-navy-900">
                        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-navy-700 text-white">
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                        <span className="text-[15px] leading-6">{p}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      {video && (
        <VideoFeature
          src={video}
          eyebrow={c.t("services.video_eyebrow")}
          title={c.t("services.video_title")}
          text={c.t("services.video_text")}
          labels={{ play: c.t("services.video_play"), pause: c.t("services.video_pause") }}
        />
      )}

      {/* How we work */}
      {steps.length > 0 && (
        <section className="relative isolate overflow-hidden bg-navy-950 pt-8 pb-24 text-white sm:pb-32">
          <div className="grid-lines absolute inset-0 -z-10" aria-hidden />
          <div className="container-x">
            <SectionHeading light center eyebrow={c.t("services.process_title")} title={c.t("services.process_title")} />
            <ol className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <Reveal key={i} delay={i * 0.08} className="h-full">
                  <li className="relative h-full rounded-3xl border border-white/10 bg-white/[0.04] p-8">
                    <span className="flex size-12 items-center justify-center rounded-full bg-sky text-lg font-extrabold text-navy-950" dir="ltr">
                      {i + 1}
                    </span>
                    <h3 className="mt-6 text-xl font-extrabold">{step.title}</h3>
                    {step.text && <p className="mt-3 leading-7 text-white/65">{step.text}</p>}
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      <CtaBand c={c} />
    </>
  );
}
