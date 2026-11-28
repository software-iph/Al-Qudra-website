import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand, PageHero } from "@/components/site/Blocks";
import { BrandSymbol } from "@/components/site/Brand";
import { ChapterGrid, ChapterIndex, DataSheet, Figure, RailLabel } from "@/components/site/Chapter";
import { Icon } from "@/components/site/Icon";
import { Reveal, SplitText } from "@/components/site/Motion";
import { ServiceChapters } from "@/components/site/ServiceChapters";
import { Tabs } from "@/components/site/Tabs";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = await getContent(lang);
  return { title: c.t("about.title"), description: c.t("about.intro") };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * About ALQUDRA — a short company narrative in four chapters, built so trust lands early:
 * 01 who we are (story beside Golden Square, then the figures) · 02 what we do (services, how we work)
 * · 03 purpose & principles (mission, vision, then Q³ / values / strengths / goals as tabs, one at a time)
 * · 04 where we work (Golden Square, IPH, closing line). The site film lives on the Gallery page.
 */
export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);
  const [lead, ...story] = c.list("about.story");
  const steps = c.list("services.process").map((line) => {
    const i = line.indexOf(":");
    return i < 0 ? { title: line, text: "" } : { title: line.slice(0, i).trim(), text: line.slice(i + 1).trim() };
  });
  const strip = (items: { id: number; title: string; body: string }[], accent: string) => (
    <ol className="grid border-t border-white/12 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((v, i) => (
        <li key={v.id} className={`border-b border-white/12 py-7 sm:pe-6 lg:border-b-0 ${i ? "lg:border-s lg:border-white/12 lg:ps-6" : ""}`}>
          <span className={`font-bold tabular-nums ${accent}`} dir="ltr">
            {pad(i + 1)}
          </span>
          <h3 className="mt-4 text-lg font-bold">{v.title}</h3>
          {v.body && <p className="mt-2 text-[15px] leading-relaxed text-white/70">{v.body}</p>}
        </li>
      ))}
    </ol>
  );
  const statement = "font-display text-[clamp(1.45rem,2.3vw,2.15rem)] leading-[1.3] font-bold tracking-[-0.02em]";

  return (
    <>
      <PageHero kicker={c.t("nav.about")} title={c.t("about.title")} intro={c.t("about.intro")} image={c.media("about.hero_image")} />

      {/* 01 · Who we are — the story beside Golden Square, then the figures */}
      <section className="py-20 sm:py-24">
        <ChapterGrid rail={<ChapterIndex n={1} label={c.t("about.story_title")} />}>
          <div className="grid gap-12 md:grid-cols-12 md:gap-x-12">
            <div className="md:col-span-7">
              {lead && (
                <Reveal>
                  <p className={`${statement} text-ink`}>{lead}</p>
                </Reveal>
              )}
              <div className="mt-8 grid gap-5">
                {story.map((p, i) => (
                  <Reveal key={i} delay={0.04 * (i + 1)}>
                    <p className="lead">{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <Figure src={c.media("about.story_image")} caption={c.t("contact.address")} light={false} className="md:sticky md:top-28" />
            </div>
          </div>
          <div className="mt-20">
            <DataSheet light={false} items={c.items("stats").slice(0, 3).map((s) => ({ id: s.id, value: s.body, label: s.title }))} />
          </div>
        </ChapterGrid>
      </section>

      {/* 02 · What we do — the services as scroll chapters, then how the work runs */}
      <section id="services" className="scroll-mt-20 pb-20 sm:pb-24">
        <ChapterGrid rail={<ChapterIndex n={2} label={c.t("services.eyebrow")} />}>
          <div className="grid gap-6 md:grid-cols-12 md:gap-x-12">
            <SplitText text={c.t("services.title")} className="heading md:col-span-7" />
            <Reveal className="md:col-span-5 md:pt-3">
              <p className="lead">{c.t("services.intro")}</p>
            </Reveal>
          </div>
          <ServiceChapters services={c.services} />

          {steps.length > 0 && (
            <div className="mt-20">
              <RailLabel>{c.t("services.process_title")}</RailLabel>
              <ol className="mt-8 grid border-t border-navy-800/15 sm:grid-cols-2 lg:grid-cols-4">
                {steps.map((step, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <li className={`h-full border-b border-navy-800/15 py-7 sm:pe-6 lg:border-b-0 ${i ? "lg:border-s lg:border-navy-800/15 lg:ps-6" : ""}`}>
                      <span className="font-bold text-patina-700 tabular-nums" dir="ltr">
                        {pad(i + 1)}
                      </span>
                      <h3 className="mt-4 text-lg font-bold text-ink">{step.title}</h3>
                      {step.text && <p className="mt-2 text-[15px] leading-relaxed text-muted">{step.text}</p>}
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          )}
        </ChapterGrid>
      </section>


      {/* 03 · Purpose & principles — mission and vision, then the four "what drives us" lists as tabs */}
      <section className="on-dark relative isolate overflow-hidden bg-navy-900 py-20 text-white sm:py-24">
        <BrandSymbol className="pointer-events-none absolute -start-[12%] top-[22%] -z-10 size-[52rem] -translate-y-1/2 text-navy-500/35 blur-[50px]" />
        <ChapterGrid rail={<ChapterIndex n={3} label={`${c.t("about.mission_title")} · ${c.t("about.vision_title")}`} light />}>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            {[
              { title: c.t("about.mission_title"), text: c.t("about.mission") },
              { title: c.t("about.vision_title"), text: c.t("about.vision") },
            ].map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08}>
                <RailLabel light>{b.title}</RailLabel>
                <p className="mt-6 font-display text-[clamp(1.25rem,1.9vw,1.75rem)] leading-[1.38] font-bold tracking-[-0.015em] text-white">{b.text}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-20">
            <Tabs
              light
              label={c.t("home.q3_eyebrow")}
              tabs={[
                {
                  id: "q3",
                  label: c.t("home.q3_title"),
                  panel: (
                    <>
                      <p className="max-w-2xl text-lg leading-[1.75] text-white/72">{c.t("home.q3_text")}</p>
                      <ol className="mt-10 grid border-t border-white/12 md:grid-cols-3">
                        {c.items("q3").map((q, i) => (
                          <li key={q.id} className={`py-8 max-md:border-b max-md:border-white/12 md:pe-8 ${i ? "md:border-s md:border-white/12 md:ps-8" : ""}`}>
                            <span className="font-display text-[3.25rem] leading-none font-bold tracking-[-0.05em]" dir="ltr">
                              Q<sup className="text-[0.42em] text-patina-400">{i + 1}</sup>
                            </span>
                            <h3 className="mt-6 text-xl font-bold">{q.title}</h3>
                            <p className="mt-3 leading-relaxed text-white/70">{q.body}</p>
                          </li>
                        ))}
                      </ol>
                    </>
                  ),
                },
                {
                  id: "values",
                  label: c.t("about.values_title"),
                  panel: (
                    <>
                      <p className="max-w-2xl text-lg leading-[1.75] text-white/72">{c.t("about.values_text")}</p>
                      <div className="mt-10">{strip(c.items("values"), "text-white/40")}</div>
                    </>
                  ),
                },
                {
                  id: "why",
                  label: c.t("home.strengths_eyebrow"),
                  panel: (
                    <>
                      <p className="max-w-2xl text-lg leading-[1.75] text-white/72">
                        <strong className="font-bold text-white">{c.t("home.strengths_title")}</strong> {c.t("home.strengths_text")}
                      </p>
                      <ul className="mt-10 grid border-t border-white/12 sm:grid-cols-2 lg:grid-cols-4">
                        {c.items("strengths").map((s, i) => (
                          <li key={s.id} className={`border-b border-white/12 py-7 sm:pe-6 ${i % 4 ? "lg:border-s lg:border-white/12 lg:ps-6" : ""}`}>
                            <Icon name={s.icon} className="size-5 text-patina-400" strokeWidth={1.5} />
                            <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                            <p className="mt-2 text-[15px] leading-relaxed text-white/68">{s.body}</p>
                          </li>
                        ))}
                      </ul>
                    </>
                  ),
                },
                { id: "goals", label: c.t("about.goals_title"), panel: strip(c.items("goals"), "text-patina-400") },
              ]}
            />
          </Reveal>
        </ChapterGrid>
      </section>

      {/* 04 · Where we work — Golden Square, IPH Group, and the company's closing line */}
      <section className="py-20 sm:py-24">
        <ChapterGrid rail={<ChapterIndex n={4} label={c.t("about.where_title")} />}>
          <div className="grid gap-12 md:grid-cols-12 md:gap-x-12">
            <div className="md:col-span-5">
              <Reveal>
                <h2 className="title text-ink">{c.t("contact.address")}</h2>
                <p className="lead mt-5">{c.t("about.where_text")}</p>
              </Reveal>
              <Reveal delay={0.06}>
                <a href="https://iph-ly.com" target="_blank" rel="noopener noreferrer" className="group mt-10 flex items-center gap-5 border-y border-navy-800/15 py-5">
                  <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-[4px] bg-navy-900 px-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.media("brand.iph_logo")} alt="IPH Group" className="max-h-8 w-auto" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-ink">{c.t("about.iph_title")}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-muted">{c.t("about.iph_text")}</span>
                  </span>
                  <ArrowUpRight className="flip-rtl size-5 shrink-0 text-navy-800 transition-transform duration-[220ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </a>
              </Reveal>
            </div>
            <Reveal className="md:col-span-7" delay={0.04}>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[4px] bg-limestone">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.media("about.where_image")} alt={c.t("contact.address")} loading="lazy" className="photo absolute inset-0 size-full object-cover" />
              </div>
            </Reveal>
          </div>

          {c.t("about.quote") && (
            <Reveal className="mt-14">
              <blockquote className="border-s-2 border-navy-800 ps-6 sm:ps-10">
                <p className={`${statement} max-w-4xl text-ink`}>{c.t("about.quote")}</p>
                <footer className="label-mono mt-5 text-concrete">{c.t("hero.scene4_kicker")}</footer>
              </blockquote>
            </Reveal>
          )}
        </ChapterGrid>
      </section>

      <CtaBand c={c} />
    </>
  );
}
