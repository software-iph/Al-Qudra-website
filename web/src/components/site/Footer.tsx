import { Mail, MapPin, Phone } from "lucide-react";
import { NavLink } from "./NavLink";
import type { Content } from "@/lib/content";
import { SubscribeForm } from "./Forms";
import { SocialIcons } from "./SocialIcons";

export function Footer({ c, nav }: { c: Content; nav: { href: string; label: string }[] }) {
  const phone = c.setting("phone");
  const email = c.setting("email");

  return (
    <footer className="relative overflow-hidden bg-navy-950 text-white">
      <div className="grid-lines absolute inset-0 opacity-60" aria-hidden />
      <div className="absolute -top-40 end-[-10%] size-[520px] rounded-full bg-navy-600/30 blur-3xl" aria-hidden />

      <div className="container-x relative grid gap-12 py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={c.media("brand.logo_light")} alt="Alqudra" className="h-11 w-auto" />
          <p className="mt-6 max-w-sm leading-8 text-white/60">{c.t("footer.about")}</p>
          <SocialIcons setting={c.setting} className="mt-6" />
        </div>

        <div className="lg:col-span-2">
          <h3 className="text-sm font-bold tracking-wide text-sky">{c.t("footer.links")}</h3>
          <ul className="mt-5 grid gap-3">
            {nav.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} className="text-white/70 transition hover:text-white">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-sm font-bold tracking-wide text-sky">{c.t("footer.contact")}</h3>
          <ul className="mt-5 grid gap-4 text-white/70">
            <li className="flex gap-3">
              <MapPin className="mt-1 size-5 shrink-0 text-sky" aria-hidden />
              <span className="leading-7">{c.t("contact.address")}</span>
            </li>
            {phone && (
              <li>
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="flex gap-3 transition hover:text-white">
                  <Phone className="size-5 shrink-0 text-sky" aria-hidden />
                  <span dir="ltr">{phone}</span>
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="flex gap-3 transition hover:text-white">
                  <Mail className="size-5 shrink-0 text-sky" aria-hidden />
                  <span dir="ltr">{email}</span>
                </a>
              </li>
            )}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h3 className="text-sm font-bold tracking-wide text-sky">{c.t("footer.newsletter")}</h3>
          <p className="mt-5 mb-4 text-sm leading-7 text-white/60">{c.t("footer.newsletter_text")}</p>
          <SubscribeForm
            labels={{
              placeholder: c.t("forms.subscribe_placeholder"),
              button: c.t("forms.subscribe_button"),
              success: c.t("forms.subscribe_success"),
              invalid: c.t("forms.invalid"),
              error: c.t("forms.error"),
            }}
          />
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-sm text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {c.t("footer.rights")}
          </p>
          <a href="https://www.alqudra-ec.com" className="hover:text-white" dir="ltr">
            www.alqudra-ec.com
          </a>
        </div>
      </div>
    </footer>
  );
}
