import { Check, Quote } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand, PageHero, SectionHeading } from "@/components/site/Blocks";
import { Icon } from "@/components/site/Icon";
import { Reveal, RevealImage, SplitText } from "@/components/site/Motion";
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

      {/* Story: a large photo with a short opening */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <RevealImage src={c.media("about.story_image")} className="aspect-[4/5] rounded-[2rem] sm:aspect-[4/3] lg:col-span-7 lg:aspect-[5/6]" />
          <div className="lg:col-span-5">
            <SectionHeading title={c.t("about.story_title")} />
            <div className="mt-8 grid gap-5">
              {story.map((p, i) => (
                <Reveal key={i} delay={0.15 + i * 0.08}>
                  <p className={i === 0 ? "text-xl leading-9 font-bold text-navy-900" : "lead"}>{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & mission over a full-width photo */}
      <section className="relative isolate overflow-hidden bg-navy-950 text-white">
        <RevealImage src={c.media("about.vision_image")} className="absolute inset-0 -z-10 opacity-60" drift={10} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/20" aria-hidden />
        <div className="container-x grid gap-14 pt-64 pb-20 sm:pt-80 sm:pb-24 lg:grid-cols-2 lg:gap-20">
          {[
            { title: c.t("about.vision_title"), text: c.t("about.vision") },
            { title: c.t("about.mission_title"), text: c.t("about.mission") },
          ].map((b, i) => (
            <Reveal key={b.title} delay={i * 0.12}>
              <span className="block h-px w-16 bg-sky" aria-hidden />
              <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">{b.title}</h2>
              <p className="mt-4 max-w-lg text-lg leading-8 text-white/75">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values: names only */}
      <section className="py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading center title={c.t("about.values_title")} />
          <ul className="mt-14 flex flex-wrap justify-center gap-x-12 gap-y-10">
            {c.items("values").map((v, i) => (
              <Reveal key={v.id} delay={i * 0.06}>
                <li className="group flex w-32 flex-col items-center gap-4 text-center" title={v.body}>
                  <span className="icon-tile size-16 transition duration-300 group-hover:bg-navy-700 group-hover:text-white">
                    <Icon name={v.icon} className="size-7" />
                  </span>
                  <span className="text-lg font-extrabold text-navy-900">{v.title}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Services: photo first, short text */}
      <section id="services" className="scroll-mt-20 bg-paper py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading title={c.t("services.title")} />
          <div className="mt-16 grid gap-24 sm:gap-32">
            {c.services.map((s, i) => (
              <article key={s.id} id={`service-${s.id}`} className="grid scroll-mt-28 items-center gap-10 lg:grid-cols-12 lg:gap-16">
                <RevealImage src={s.image} className={`aspect-[4/3] rounded-[2rem] lg:col-span-7 lg:aspect-[16/11] ${i % 2 ? "lg:order-2" : ""}`} />
                <div className="lg:col-span-5">
                  <Reveal>
                    <span className="icon-tile size-14">
                      <Icon name={s.icon} className="size-7" />
                    </span>
                  </Reveal>
                  <SplitText text={s.title} as="h3" delay={0.1} className="heading mt-6 !text-3xl sm:!text-4xl" />
                  <Reveal delay={0.2}>
                    <p className="lead mt-5">{s.summary}</p>
                    {s.points.length > 0 && (
                      <ul className="mt-7 grid gap-3">
                        {s.points.slice(0, 4).map((p) => (
                          <li key={p} className="flex items-start gap-3 font-bold text-navy-900">
                            <Check className="mt-1 size-4 shrink-0 text-navy-600" strokeWidth={3} />
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

      {/* How we work */}
      {steps.length > 0 && (
        <section className="relative isolate overflow-hidden bg-navy-950 py-24 text-white sm:py-32">
          <div className="container-x">
            <SectionHeading light center title={c.t("services.process_title")} />
            <ol className="relative mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {steps.map((step, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <li className="relative border-t border-white/15 pt-8">
                    <span className="flex size-11 items-center justify-center rounded-full bg-sky text-lg font-extrabold text-navy-950" dir="ltr">
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

      {/* Strategic goals: titles only */}
      <section className="py-24 sm:py-28">
        <div className="container-x">
          <SectionHeading title={c.t("about.goals_title")} />
          <ul className="mt-12 grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {c.items("goals").map((g, i) => (
              <Reveal key={g.id} delay={(i % 3) * 0.07}>
                <li className="flex items-center gap-4 border-b border-line pb-6" title={g.body}>
                  <span className="icon-tile size-12 shrink-0">
                    <Icon name={g.icon} className="size-5" />
                  </span>
                  <span className="text-lg font-extrabold text-navy-900">{g.title}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Quote over a photo */}
      <section className="container-x">
        <figure className="relative isolate overflow-hidden rounded-[2rem] bg-navy-950 px-8 py-24 text-center text-white sm:px-20 sm:py-32">
          <RevealImage src={c.media("home.cta_image")} className="absolute inset-0 -z-10 opacity-40" drift={10} />
          <div className="absolute inset-0 -z-10 bg-navy-950/55" aria-hidden />
          <Reveal>
            <Quote className="mx-auto size-12 text-sky" strokeWidth={1.5} />
            <blockquote className="mx-auto mt-6 max-w-3xl text-2xl leading-relaxed font-extrabold text-balance sm:text-3xl">{c.t("about.quote")}</blockquote>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.media("brand.logo_light")} alt="Alqudra" className="mx-auto mt-10 h-9 w-auto opacity-80" />
          </Reveal>
        </figure>
      </section>

      <CtaBand c={c} />
    </>
  );
}
