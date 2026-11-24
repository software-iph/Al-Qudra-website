import { Check } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand, PageHero, SectionHeading } from "@/components/site/Blocks";
import { Icon } from "@/components/site/Icon";
import { Arc, MeasuredRule, Reveal, RevealImage, SplitText, Tiles } from "@/components/site/Motion";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "من نحن" : "About us" };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);
  // The opening of the story is enough here; the photos carry the rest.
  const story = c.list("about.story").slice(0, 2);
  const steps = c.list("services.process").map((line) => {
    const [title, ...rest] = line.split(":");
    return rest.length ? { title: title.trim(), text: rest.join(":").trim() } : { title: line, text: "" };
  });

  return (
    <>
      <PageHero c={c} title={c.t("about.title")} intro={c.t("about.intro")} image={c.media("about.hero_image")} />

      {/* Story: a large documentary photo with a short opening */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <RevealImage src={c.media("about.story_image")} className="aspect-[4/5] sm:aspect-[4/3] lg:col-span-7 lg:aspect-[5/6]" />
          <div className="lg:col-span-5">
            <Tiles className="mb-8" />
            <SectionHeading title={c.t("about.story_title")} />
            <div className="mt-8 grid gap-5">
              {story.map((p, i) => (
                <Reveal key={i} delay={0.12 + i * 0.06}>
                  <p className={i === 0 ? "text-xl leading-9 font-semibold text-ink" : "lead"}>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & mission over a full-width photo */}
      <section className="relative isolate overflow-hidden bg-navy-900 text-paper">
        <RevealImage src={c.media("about.vision_image")} className="absolute inset-0 -z-10 opacity-55" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-900 via-navy-900/75 to-navy-900/20" aria-hidden />
        <div className="container-x pt-64 pb-20 sm:pt-80 sm:pb-24">
          <div className="grid gap-12 border-t border-paper/20 pt-12 lg:grid-cols-2 lg:gap-20">
            {[
              { title: c.t("about.vision_title"), text: c.t("about.vision") },
              { title: c.t("about.mission_title"), text: c.t("about.mission") },
            ].map((b, i) => (
              <Reveal key={b.title} delay={i * 0.06}>
                <h2 className="text-3xl font-extrabold sm:text-4xl" style={{ fontStretch: "112%" }}>
                  {b.title}
                </h2>
                <p className="mt-4 max-w-lg text-lg leading-8 text-paper/80">{b.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values: names on a hairline row */}
      <section className="py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading title={c.t("about.values_title")} />
          <ul className="mt-12 grid border-t border-line sm:grid-cols-3 lg:grid-cols-5">
            {c.items("values").map((v, i) => (
              <Reveal key={v.id} delay={Math.min(i, 5) * 0.06}>
                <li className="flex h-full items-center gap-4 border-b border-line py-7 sm:flex-col sm:items-start sm:pe-6" title={v.body}>
                  <Icon name={v.icon} className="size-7 text-navy-700" />
                  <span className="text-lg font-bold text-ink">{v.title}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Services: photo first, short text */}
      <section id="services" className="scroll-mt-20 border-t border-line bg-limestone/50 py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading title={c.t("services.title")} />
          <div className="mt-16 grid gap-24 sm:gap-32">
            {c.services.map((s, i) => (
              <article key={s.id} id={`service-${s.id}`} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <RevealImage src={s.image} className={`aspect-[4/3] lg:col-span-7 lg:aspect-[16/11] ${i % 2 ? "lg:order-2" : ""}`} />
                <div className="lg:col-span-5">
                  <Reveal>
                    <Icon name={s.icon} className="size-8 text-navy-700" />
                  </Reveal>
                  <SplitText text={s.title} as="h3" delay={0.06} className="heading mt-6 !text-3xl sm:!text-4xl" />
                  <Reveal delay={0.18}>
                    <p className="lead mt-5">{s.summary}</p>
                    {s.points.length > 0 && (
                      <ul className="mt-7 border-t border-line">
                        {s.points.slice(0, 4).map((p) => (
                          <li key={p} className="flex items-start gap-3 border-b border-line py-3 font-medium text-ink">
                            <Check className="mt-1 size-4 shrink-0 text-navy-700" strokeWidth={2} />
                            <span className="leading-7">{p}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Reveal>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How we work: numbered steps on a measured rule */}
      {steps.length > 0 && (
        <section className="relative isolate overflow-hidden bg-navy-900 py-24 text-paper sm:py-32">
          <Arc className="-start-64 -bottom-80 size-[36rem]" />
          <div className="container-x relative">
            <SectionHeading light title={c.t("services.process_title")} />
            <MeasuredRule light className="mt-14" />
            <ol className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {steps.map((step, i) => (
                <Reveal key={i} delay={Math.min(i, 5) * 0.06}>
                  <li>
                    <span className="label-mono text-sky" dir="ltr">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h4 className="mt-4 text-xl font-bold">{step.title}</h4>
                    {step.text && <p className="mt-3 leading-7 text-paper/70">{step.text}</p>}
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Strategic goals: titles on hairlines */}
      <section className="py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading title={c.t("about.goals_title")} />
          <ul className="mt-12 grid gap-x-10 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {c.items("goals").map((g, i) => (
              <Reveal key={g.id} delay={(i % 3) * 0.06}>
                <li className="flex items-center gap-4 border-b border-line py-6" title={g.body}>
                  <Icon name={g.icon} className="size-6 shrink-0 text-navy-700" />
                  <span className="text-lg font-bold text-ink">{g.title}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Quote */}
      <section className="border-t border-line py-24 sm:py-32">
        <figure className="container-x">
          <Reveal>
            <blockquote className="max-w-4xl text-3xl leading-tight font-extrabold text-balance text-ink sm:text-5xl rtl:leading-snug" style={{ fontStretch: "112%" }}>
              {c.t("about.quote")}
            </blockquote>
            <figcaption className="mt-10 flex items-center gap-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.media("brand.logo_dark")} alt="ALQUDRA" className="h-9 w-auto" />
            </figcaption>
          </Reveal>
        </figure>
      </section>

      <CtaBand c={c} />
    </>
  );
}
