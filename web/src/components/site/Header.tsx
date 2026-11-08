"use client";

import { ArrowUpRight, Globe, Menu, X } from "lucide-react";
import { NavLink } from "./NavLink";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

type Props = {
  lang: Locale;
  logoLight: string;
  logoDark: string;
  nav: { href: string; label: string }[];
  cta: string;
};

export function Header({ lang, logoLight, logoDark, nav, cta }: Props) {
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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo ${
        solid ? "bg-white/90 shadow-[0_1px_0_rgb(0_0_0/0.06)] backdrop-blur-xl" : "bg-transparent"
      } ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-6">
        <NavLink href={`/${lang}`} className="relative z-10 shrink-0" aria-label="Alqudra">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={solid ? logoDark : logoLight} alt="Alqudra" className="h-9 w-auto sm:h-10" />
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className={`relative rounded-full px-3.5 py-2 text-[15px] font-bold whitespace-nowrap transition xl:px-4 ${
                solid ? "text-navy-900 hover:bg-navy-700/5" : "text-white/85 hover:text-white"
              } ${isActive(item.href) ? (solid ? "bg-navy-700/5 text-navy-700" : "text-white") : ""}`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className={`absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full ${solid ? "bg-navy-700" : "bg-sky"}`} />
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <NavLink
            href={switchHref}
            onClick={rememberLang}
            className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold transition ${
              solid ? "text-navy-800 hover:bg-navy-700/5" : "text-white hover:bg-white/10"
            }`}
            hrefLang={other}
          >
            <Globe className="size-4" aria-hidden />
            {other === "ar" ? "عربي" : "English"}
          </NavLink>
          <NavLink href={`/${lang}/contact`} className={`hidden xl:inline-flex ${solid ? "btn-primary" : "btn-light"} py-2.5`}>
            {cta}
            <ArrowUpRight className="flip-rtl size-4" aria-hidden />
          </NavLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`flex size-11 items-center justify-center rounded-full lg:hidden ${solid ? "text-navy-900" : "text-white"}`}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
    </header>

      {/* Mobile menu (outside <header>: its backdrop blur would trap this fixed panel) */}
      <div
        className={`fixed inset-x-0 top-20 bottom-0 z-40 overflow-y-auto bg-white transition-all duration-500 ease-out-expo lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav className="container-x flex flex-col gap-1 py-6">
          {nav.map((item, i) => (
            <NavLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              className={`border-b border-line py-4 text-2xl font-extrabold transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              } ${isActive(item.href) ? "text-navy-600" : "text-navy-900"}`}
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink href={`/${lang}/contact`} className="btn-primary mt-6 py-4 text-base">
            {cta}
          </NavLink>
        </nav>
      </div>
    </>
  );
}
