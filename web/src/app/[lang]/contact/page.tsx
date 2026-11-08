import { Clock, ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/site/Blocks";
import { ContactForm } from "@/components/site/Forms";
import { Reveal } from "@/components/site/Motion";
import { SocialIcons } from "@/components/site/SocialIcons";
import { getContent } from "@/lib/content";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "تواصل معنا" : "Contact us" };
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
    { icon: MapPin, label: c.t("contact.address_label"), value: c.t("contact.address"), href: map || undefined },
    phone && { icon: Phone, label: c.t("contact.phone_label"), value: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}`, ltr: true },
    email && { icon: Mail, label: c.t("contact.email_label"), value: email, href: `mailto:${email}`, ltr: true },
    { icon: Clock, label: c.t("contact.hours_label"), value: c.t("contact.hours") },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string; href?: string; ltr?: boolean }[];

  return (
    <>
      <PageHero c={c} title={c.t("contact.title")} intro={c.t("contact.intro")} image={c.media("contact.hero_image")} />

      <section className="py-24 sm:py-32">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative h-full overflow-hidden rounded-[2rem] bg-navy-900 p-8 text-white sm:p-10">
              <div className="grid-lines absolute inset-0" aria-hidden />
              <div className="relative grid gap-7">
                {info.map((item) => {
                  const body = (
                    <>
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-sky">
                        <item.icon className="size-5" />
                      </span>
                      <span>
                        <span className="block text-sm text-white/55">{item.label}</span>
                        <span className="mt-1 block text-lg leading-7 font-bold" dir={item.ltr ? "ltr" : undefined}>
                          {item.value}
                        </span>
                      </span>
                    </>
                  );
                  return item.href ? (
                    <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="flex gap-5 transition hover:text-sky">
                      {body}
                    </a>
                  ) : (
                    <div key={item.label} className="flex gap-5">
                      {body}
                    </div>
                  );
                })}
              </div>
              <div className="relative mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-8">
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn bg-[#25d366] text-white hover:-translate-y-0.5">
                    <MessageCircle className="size-4" /> WhatsApp
                  </a>
                )}
                {map && (
                  <a href={map} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    <ExternalLink className="size-4" /> {c.t("contact.map")}
                  </a>
                )}
              </div>
              <SocialIcons setting={c.setting} className="relative mt-6" />
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div className="rounded-[2rem] border border-line p-8 sm:p-10">
              <h2 className="text-2xl font-extrabold text-navy-900">{c.t("contact.form_title")}</h2>
              <div className="mt-8">
                <ContactForm
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
                  }}
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
