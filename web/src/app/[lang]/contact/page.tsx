import { ExternalLink, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/Blocks";
import { ChapterGrid, ChapterIndex, SpecList } from "@/components/site/Chapter";
import { ContactForm } from "@/components/site/Forms";
import { Reveal } from "@/components/site/Motion";
import { SocialIcons } from "@/components/site/SocialIcons";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = await getContent(lang);
  return { title: c.t("contact.title"), description: c.t("contact.intro") };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);
  const phone = c.setting("phone");
  const email = c.setting("email");
  const whatsapp = c.setting("whatsapp").replace(/\D/g, "");
  const map = c.setting("map_url");

  const info = [
    phone && { label: c.t("contact.phone_label"), value: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}`, ltr: true },
    email && { label: c.t("contact.email_label"), value: email, href: `mailto:${email}`, ltr: true },
    { label: c.t("contact.address_label"), value: c.t("contact.address"), href: map || undefined },
    { label: c.t("contact.hours_label"), value: c.t("contact.hours") },
  ].filter(Boolean) as { label: string; value: string; href?: string; ltr?: boolean }[];

  return (
    <>
      <PageHero kicker={c.t("nav.contact")} title={c.t("contact.title")} intro={c.t("contact.intro")} image={c.media("contact.hero_image")} />

      {/* 01 · Contact details as a data sheet, the message form beside it — no boxes, one grid */}
      <section className="py-24 sm:py-32">
        <ChapterGrid rail={<ChapterIndex n={1} label={c.t("nav.contact")} />}>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-x-16">
            <Reveal className="lg:col-span-4">
              <SpecList rows={info} stacked />
              <div className="mt-8 flex flex-wrap gap-3">
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    <MessageCircle className="size-4" aria-hidden /> WhatsApp
                  </a>
                )}
                {map && (
                  <a href={map} target="_blank" rel="noopener noreferrer" className="btn-outline">
                    <ExternalLink className="size-4" aria-hidden /> {c.t("contact.map")}
                  </a>
                )}
              </div>
              <SocialIcons setting={c.setting} surface="light" className="mt-8" />
            </Reveal>

            <Reveal delay={0.06} className="lg:col-span-8">
              <h2 className="title text-ink">{c.t("contact.form_title")}</h2>
              <div className="mt-8 border-t border-navy-800/15 pt-8">
                  <ContactForm
                    privacyHref={`/${lang}/privacy`}
                    labels={{
                      name: c.t("contact.name"),
                      email: c.t("contact.email"),
                      phone: c.t("contact.phone"),
                      subject: c.t("contact.subject"),
                      message: c.t("contact.message"),
                      send: c.t("contact.send"),
                      sending: c.t("forms.sending"),
                      success: c.t("forms.contact_success"),
                      invalid: c.t("forms.invalid"),
                      error: c.t("forms.error"),
                      busy: c.t("forms.busy"),
                      consent: c.t("forms.consent_contact"),
                      consentLink: c.t("forms.consent_link"),
                      consentMissing: c.t("forms.consent_missing"),
                    }}
                  />
              </div>
            </Reveal>
          </div>
        </ChapterGrid>
      </section>
    </>
  );
}
