import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { CardGrid, CtaBand, Q3Section, SectionHeading } from "@/components/site/Blocks";
import { Icon } from "@/components/site/Icon";
import { GalleryMarquee } from "@/components/site/GalleryMarquee";
import { CountUp, HeroParallax, RevealImage, Reveal, ScrollCue, SplitText } from "@/components/site/Motion";
import { SmartVideo } from "@/components/site/SmartVideo";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);
  const stats = c.items("stats");

  return (
    <>
      {/* ---------- Hero ---------- */}
      <HeroParallax
        className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-navy-950 pt-32 pb-10 text-white"
        background={
          <>
            <SmartVideo src={c.media("home.hero_video")} poster={c.media("home.hero_poster")} eager className="aq-hero-video size-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/30" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 to-transparent rtl:bg-gradient-to-l" aria-hidden />
            <div className="grid-lines absolute inset-0 opacity-50" aria-hidden />
          </>
        }
      >
        <div className="container-x">
          <div className="max-w-4xl">
            <Reveal onMount delay={0.1}>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white/85 backdrop-blur">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-sky" />
                </span>
                {c.t("home.hero_eyebrow")}
              </p>
            </Reveal>
            <SplitText
              as="h1"
              onMount
              delay={0.25}
              text={c.t("home.hero_title")}
              className="mt-7 text-4xl leading-[1.1] font-extrabold tracking-tight sm:text-6xl lg:text-7xl rtl:leading-[1.3] rtl:tracking-normal"
            />
            <Reveal onMount delay={0.7}>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-white/75">{c.t("home.hero_text")}</p>
            </Reveal>
            <Reveal onMount delay={0.85}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link href={`/${lang}/services`} className="btn-light group px-7 py-4 text-base">
                  {c.t("home.hero_primary")}
                  <ArrowRight className="flip-rtl size-5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" aria-hidden />
                </Link>
                <Link href={`/${lang}/contact`} className="btn-ghost px-7 py-4 text-base">
                  {c.t("home.hero_secondary")}
                </Link>
              </div>
            </Reveal>
          </div>

          {stats.length > 0 && (
            <Reveal onMount delay={1.05} className="mt-16 sm:mt-24">
              <div className="grid divide-white/10 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl sm:grid-cols-3 sm:divide-x rtl:sm:divide-x-reverse">
                {stats.map((s) => (
                  <div key={s.id} className="flex items-center gap-5 px-7 py-6 sm:py-8">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-sky">
                      <Icon name={s.icon} className="size-6" />
                    </div>
                    <div>
                      <CountUp value={Number(s.body) || 0} className="block text-3xl font-extrabold sm:text-4xl" />
                      <span className="text-sm text-white/65">{s.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
          <div className="mt-8 hidden justify-center lg:flex">
            <ScrollCue label={c.t("nav.scroll")} />
          </div>
        </div>
      </HeroParallax>

      {/* ---------- Who we are ---------- */}
      <section className="overflow-hidden py-24 sm:py-32">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2">
          <div className="relative pb-16 lg:pb-0">
            <RevealImage src={c.media("home.about_image")} className="aspect-[4/5] rounded-[2rem] sm:aspect-square" />
            <Reveal delay={0.5} y={50} className="absolute -bottom-2 end-0 w-1/2 overflow-hidden rounded-3xl border-8 border-white shadow-2xl sm:-end-6 lg:-bottom-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.media("home.about_image_2")} alt="" className="aspect-square w-full object-cover" />
            </Reveal>
            {stats[0] && (
              <Reveal delay={0.8} y={16} className="absolute start-6 top-6">
                <div className="aq-float rounded-2xl bg-white/95 px-5 py-4 shadow-xl backdrop-blur">
                  <CountUp value={Number(stats[0].body) || 0} className="block text-3xl font-extrabold text-navy-700" />
                  <span className="text-sm font-bold text-muted">{stats[0].title}</span>
                </div>
              </Reveal>
            )}
          </div>

          <div>
            <SectionHeading eyebrow={c.t("home.about_eyebrow")} title={c.t("home.about_title")} text={c.t("home.about_text")} />
            <Reveal delay={0.1}>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {c.items("values").slice(0, 4).map((v) => (
                  <li key={v.id} className="flex items-center gap-3 font-bold text-navy-900">
                    <span className="flex size-7 items-center justify-center rounded-full bg-sky-soft text-navy-700">
                      <Check className="size-4" strokeWidth={3} />
                    </span>
                    {v.title}
                  </li>
                ))}
              </ul>
              <Link href={`/${lang}/about`} className="btn-primary mt-10">
                {c.t("nav.learn_more")}
                <ArrowRight className="flip-rtl size-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <Q3Section c={c} />

      {/* ---------- Services ---------- */}
      <section className="bg-paper py-24 sm:py-32">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={c.t("home.services_eyebrow")} title={c.t("home.services_title")} />
            <Reveal>
              <Link href={`/${lang}/services`} className="btn-outline">
                {c.t("nav.view_all")}
                <ArrowRight className="flip-rtl size-4" aria-hidden />
              </Link>
            </Reveal>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {c.services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 0.1} className="h-full">
                <Link
                  href={`/${lang}/services#service-${s.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-navy-900/10"
                >
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt="" className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                    <span className="absolute bottom-4 start-4 flex size-12 items-center justify-center rounded-2xl bg-white text-navy-700">
                      <Icon name={s.icon} className="size-6" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-xl font-extrabold text-navy-900">{s.title}</h3>
                    <p className="mt-3 flex-1 leading-7 text-muted">{s.summary}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-navy-600">
                      {c.t("nav.learn_more")}
                      <ArrowUpRight className="flip-rtl size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- What sets us apart ---------- */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading center eyebrow={c.t("home.strengths_eyebrow")} title={c.t("home.strengths_title")} text={c.t("home.strengths_text")} />
          <div className="mt-14">
            <CardGrid items={c.items("strengths")} />
          </div>
        </div>
      </section>

      {/* ---------- Gallery strip ---------- */}
      <GalleryMarquee c={c} />

      <CtaBand c={c} />
    </>
  );
}
