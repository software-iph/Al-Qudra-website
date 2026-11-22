import { Check, Eye, Quote, Target } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardGrid, CtaBand, PageHero, Q3Section, SectionHeading, StatsShowcase } from "@/components/site/Blocks";
import { Icon } from "@/components/site/Icon";
import { CountUp, Reveal, RevealImage } from "@/components/site/Motion";
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
  const story = c.list("about.story");
  const stats = c.items("stats");
  const steps = c.list("services.process").map((line) => {
    const [title, ...rest] = line.split(":");
    return rest.length ? { title: title.trim(), text: rest.join(":").trim() } : { title: line, text: "" };
  });

  return (
    <>
      <PageHero c={c} title={c.t("about.title")} intro={c.t("about.intro")} image={c.media("about.hero_image")} />

      {/* Story */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading eyebrow={c.t("home.about_eyebrow")} title={c.t("about.story_title")} />
            <div className="mt-8 grid gap-6">
              {story.map((p, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <p className={`leading-9 ${i === 0 ? "text-xl font-bold text-navy-900" : "text-lg text-muted"}`}>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.1} className="lg:col-span-5">
            <RevealImage src={c.media("about.story_image")} className="sticky top-28 aspect-[3/4] rounded-[2rem]" />
          </Reveal>
        </div>
      </section>

      {/* Vision & mission */}
      <section className="relative isolate overflow-hidden bg-paper py-24 sm:py-32">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          {[
            { icon: Eye, title: c.t("about.vision_title"), text: c.t("about.vision") },
            { icon: Target, title: c.t("about.mission_title"), text: c.t("about.mission") },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 0.1} className="h-full">
              <div className={`relative h-full overflow-hidden rounded-[2rem] p-10 sm:p-12 ${i === 0 ? "bg-navy-800 text-white" : "bg-white"}`}>
                <b.icon className={`size-10 ${i === 0 ? "text-sky" : "text-navy-600"}`} strokeWidth={1.5} />
                <h2 className={`mt-8 text-3xl font-extrabold ${i === 0 ? "" : "text-navy-900"}`}>{b.title}</h2>
                <p className={`mt-5 text-lg leading-9 ${i === 0 ? "text-white/75" : "text-muted"}`}>{b.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading center eyebrow={c.t("about.values_title")} title={c.t("about.values_title")} text={c.t("about.values_text")} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {c.items("values").map((v, i) => (
              <Reveal key={v.id} delay={i * 0.06} className="h-full">
                <div className="card group h-full text-center">
                  <div className="icon-tile mx-auto group-hover:bg-navy-700 group-hover:text-white">
                    <Icon name={v.icon} className="size-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-extrabold text-navy-900">{v.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-muted">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <StatsShowcase items={stats} />

      <Q3Section c={c} />

      {/* Services */}
      <section id="services" className="scroll-mt-20 bg-paper py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={c.t("nav.services")} title={c.t("services.title")} text={c.t("services.intro")} />
          <div className="mt-16 grid gap-20 sm:gap-28">
            {c.services.map((s, i) => (
              <article key={s.id} id={`service-${s.id}`} className="grid scroll-mt-28 items-center gap-12 lg:grid-cols-2 lg:gap-20">
                <Reveal className={i % 2 ? "lg:order-2" : ""}>
                  <div className="relative overflow-hidden rounded-[2rem]">
                    <RevealImage src={s.image} className="aspect-[4/3]" />
                    <span className="absolute top-6 start-6 rounded-full bg-white/95 px-4 py-2 text-sm font-extrabold text-navy-700 shadow" dir="ltr">
                      0{i + 1}
                    </span>
                  </div>
                </Reveal>
                <Reveal delay={0.1}>
                  <div className="icon-tile size-14">
                    <Icon name={s.icon} className="size-7" />
                  </div>
                  <h3 className="heading mt-6 !text-3xl sm:!text-4xl">{s.title}</h3>
                  <p className="lead mt-5">{s.summary}</p>
                  {s.points.length > 0 && (
                    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                      {s.points.map((p) => (
                        <li key={p} className="flex items-start gap-3 rounded-2xl bg-white p-4 font-bold text-navy-900 shadow-sm">
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
        </div>
      </section>

      {/* How we work */}
      {steps.length > 0 && (
        <section className="relative isolate overflow-hidden bg-navy-950 py-24 text-white sm:py-32">
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
                    <h4 className="mt-6 text-xl font-extrabold">{step.title}</h4>
                    {step.text && <p className="mt-3 leading-7 text-white/65">{step.text}</p>}
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Strategic goals */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={c.t("about.goals_title")} title={c.t("about.goals_title")} />
          <div className="mt-14">
            <CardGrid items={c.items("goals")} columns={3} />
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="container-x pb-8">
        <Reveal>
          <figure className="relative overflow-hidden rounded-[2rem] bg-navy-950 px-8 py-16 text-center text-white sm:px-20">
            <div className="grid-lines absolute inset-0" aria-hidden />
            <Quote className="relative mx-auto size-12 text-sky" strokeWidth={1.5} />
            <blockquote className="relative mx-auto mt-6 max-w-3xl text-2xl leading-relaxed font-extrabold sm:text-3xl">
              {c.t("about.quote")}
            </blockquote>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.media("brand.logo_light")} alt="Alqudra" className="relative mx-auto mt-10 h-9 w-auto opacity-80" />
          </figure>
        </Reveal>
      </section>

      <CtaBand c={c} />
    </>
  );
}
