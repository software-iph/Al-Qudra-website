import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Content } from "@/lib/content";
import { SubscribeForm } from "./Forms";
import { NavLink } from "./NavLink";
import { Ring } from "./Brand";
import { SocialIcons } from "./SocialIcons";

/**
 * IPH footer (Requirements Guide 7.1): company · quick links · contact · follow us, then a bottom bar
 * with the legal name, the current year, the privacy policy and the language switch.
 * Everything comes from the dashboard; the IPH endorsement links to iph-ly.com.
 */
export function Footer({ c, nav }: { c: Content; nav: { href: string; label: string }[] }) {
  const lang = c.lang;
  const phone = c.setting("phone");
  const email = c.setting("email");
  const map = c.setting("map_url");
  const other = lang === "ar" ? "en" : "ar";

  return (
    <footer className="on-dark relative isolate overflow-hidden bg-basalt-900 text-paper">
      <Ring className="-end-40 -bottom-64 size-[34rem] text-patina-700/25" />

      <div className="container-x relative grid gap-12 pt-20 pb-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
        {/* 1. Company */}
        <div className="lg:col-span-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.media("brand.logo_light")} alt="ALQUDRA" width={183} height={44} className="h-11 w-auto" />
          <p className="mt-6 max-w-sm leading-7 text-steel-300">{c.t("footer.about")}</p>
          <a
            href="https://iph-ly.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-4 rounded-[2px] border border-paper/15 py-3 ps-3 pe-5 transition-colors duration-[160ms] hover:border-paper/35"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.media("brand.iph_logo")} alt="IPH Group" width={70} height={40} className="h-10 w-auto" />
            <span className="text-sm leading-5 text-steel-200">{c.t("footer.member")}</span>
          </a>
        </div>

        {/* 2. Quick links */}
        <nav aria-label={c.t("footer.links")} className="lg:col-span-2">
          <h2 className="label-mono text-patina-400">{c.t("footer.links")}</h2>
          <ul className="mt-5 grid gap-1">
            {nav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} className="flex min-h-11 items-center text-steel-200 transition-colors duration-[160ms] hover:text-paper">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* 3. Contact (from dashboard Settings: one place to update) */}
        <div className="lg:col-span-3">
          <h2 className="label-mono text-patina-400">{c.t("footer.contact")}</h2>
          <ul className="mt-5 grid gap-1 text-steel-200">
            {phone && (
              <li>
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="flex min-h-11 items-center gap-3 transition-colors duration-[160ms] hover:text-paper">
                  <Phone className="size-[18px] shrink-0 text-patina-400" strokeWidth={1.5} aria-hidden />
                  <span dir="ltr">{phone}</span>
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="flex min-h-11 items-center gap-3 transition-colors duration-[160ms] hover:text-paper">
                  <Mail className="size-[18px] shrink-0 text-patina-400" strokeWidth={1.5} aria-hidden />
                  <span dir="ltr">{email}</span>
                </a>
              </li>
            )}
            <li>
              <a
                href={map || undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-start gap-3 py-2.5 leading-6 transition-colors duration-[160ms] hover:text-paper"
              >
                <MapPin className="mt-0.5 size-[18px] shrink-0 text-patina-400" strokeWidth={1.5} aria-hidden />
                <span>{c.t("contact.address")}</span>
              </a>
            </li>
            <li className="flex min-h-11 items-start gap-3 py-2.5 leading-6">
              <Clock className="mt-0.5 size-[18px] shrink-0 text-patina-400" strokeWidth={1.5} aria-hidden />
              <span>{c.t("contact.hours")}</span>
            </li>
          </ul>
        </div>

        {/* 4. Follow us + newsletter */}
        <div className="lg:col-span-3">
          <h2 className="label-mono text-patina-400">{c.t("footer.follow")}</h2>
          <SocialIcons setting={c.setting} whatsapp className="mt-5" />
          <h2 className="label-mono mt-10 text-patina-400">{c.t("footer.newsletter")}</h2>
          <p className="mt-3 mb-4 text-sm leading-6 text-steel-300">{c.t("footer.newsletter_text")}</p>
          <SubscribeForm
            labels={{
              placeholder: c.t("forms.subscribe_placeholder"),
              button: c.t("forms.subscribe_button"),
              success: c.t("forms.subscribe_success"),
              invalid: c.t("forms.invalid"),
              error: c.t("forms.error"),
              busy: c.t("forms.busy"),
              consent: c.t("forms.consent_newsletter"),
              consentLink: c.t("forms.consent_link"),
              privacyHref: `/${lang}/privacy`,
            }}
          />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-x relative">
        <div className="flex flex-col gap-4 border-t border-paper/10 py-6 text-sm text-steel-300 md:flex-row md:items-center md:justify-between">
          <p>
            © <span dir="ltr">{new Date().getFullYear()}</span> {c.t("footer.rights")}
            <span className="mx-2 text-paper/25" aria-hidden>
              ·
            </span>
            {c.t("footer.member")}
          </p>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <NavLink href={`/${lang}/privacy`} className="flex min-h-11 items-center transition-colors duration-[160ms] hover:text-paper">
                {c.t("footer.privacy")}
              </NavLink>
            </li>
            <li>
              <NavLink href={`/${other}`} hrefLang={other} lang={other} className="flex min-h-11 items-center transition-colors duration-[160ms] hover:text-paper">
                {other === "ar" ? "العربية" : "English"}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
