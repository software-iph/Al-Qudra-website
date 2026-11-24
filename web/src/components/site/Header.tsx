"use client";

import { ArrowUpRight, Globe, Menu, X } from "lucide-react";
import { NavLink } from "./NavLink";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
  logoLight: string;
  logoDark?: string;
  nav: { href: string; label: string }[];
  cta: string;
};

export function Header({ lang, logoLight, nav, cta }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Solid once scrolled; slides away while reading downwards, returns when scrolling up.
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 500);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const other: Locale = lang === "ar" ? "en" : "ar";
  const switchHref = pathname.replace(/^\/(ar|en)(?=\/|$)/, `/${other}`);
  const rememberLang = () => {
    document.cookie = `lang=${other}; path=/; max-age=31536000; samesite=lax`;
  };
  const isActive = (href: string) => (href === `/${lang}` ? pathname === href : pathname.startsWith(href));
  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,transform] duration-[320ms] ease-settle ${
          solid ? "bg-navy-900" : "bg-transparent"
        } ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="container-x">
          <div className={`flex h-20 items-center justify-between gap-6 border-b transition-colors duration-[320ms] ${solid ? "border-transparent" : "border-paper/15"}`}>
            <NavLink href={`/${lang}`} className="relative z-10 shrink-0" aria-label="ALQUDRA">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoLight} alt="ALQUDRA" className="h-9 w-auto sm:h-10" />
            </NavLink>

            <nav className="hidden items-center gap-1 lg:flex">
              {nav.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-2 text-[15px] font-medium whitespace-nowrap transition-colors duration-[120ms] xl:px-4 ${
                    isActive(item.href) ? "text-paper" : "text-paper/70 hover:text-paper"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && <span className="absolute inset-x-3.5 -bottom-[23px] h-0.5 bg-sky xl:inset-x-4" />}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <NavLink
                href={switchHref}
                onClick={rememberLang}
                className="flex min-h-11 items-center gap-1.5 px-3 text-sm font-medium text-paper/80 transition-colors duration-[120ms] hover:text-paper"
                hrefLang={other}
              >
                <Globe className="size-4" aria-hidden />
                {other === "ar" ? "عربي" : "English"}
              </NavLink>
              <NavLink href={`/${lang}/contact`} className="btn-accent hidden xl:inline-flex">
                {cta}
                <ArrowUpRight className="flip-rtl size-4" aria-hidden />
              </NavLink>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex size-11 items-center justify-center text-paper lg:hidden"
                aria-label="Menu"
                aria-expanded={open}
              >
                {open ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu (outside <header> so it can cover the page) */}
      <div
        className={`fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto bg-navy-900 text-paper transition-[opacity,visibility] duration-[200ms] ease-settle lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="container-x flex flex-col py-6">
          {nav.map((item, i) => (
            <NavLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${Math.min(i, 5) * 60}ms` : "0ms" }}
              className={`border-b border-paper/15 py-5 text-2xl font-bold transition-[opacity,transform] duration-[320ms] ease-settle ${
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              } ${isActive(item.href) ? "text-sky" : "text-paper"}`}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink href={`/${lang}/contact`} className="btn-accent mt-8 py-4 text-base">
            {cta}
          </NavLink>
        </nav>
      </div>
    </>
  );
}
