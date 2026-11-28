"use client";

import { ArrowUpRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { NavLink } from "./NavLink";

type Props = {
  lang: Locale;
  logo: string;
  nav: { href: string; label: string }[];
  cta: string;
  menuLabel: string;
};

/**
 * Same on every page: logo (home), menu with the current page marked in amber, AR / EN switch
 * that keeps the visitor on the same page, and one "Contact us" action.
 * Transparent over the dark page headers, solid Basalt once scrolled.
 */
export function Header({ lang, logo, nav, cta, menuLabel }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 640);
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
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
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
        className={`on-dark fixed inset-x-0 top-0 z-50 text-paper transition-[background-color,transform,backdrop-filter] duration-[280ms] ease-settle ${
          solid ? "bg-basalt-900/90 backdrop-blur-md" : "bg-gradient-to-b from-basalt-950/55 to-transparent"
        } ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="container-x">
          <div className={`flex h-[72px] items-center justify-between gap-6 border-b transition-colors duration-[280ms] ${solid ? "border-paper/10" : "border-transparent"}`}>
            <NavLink href={`/${lang}`} className="relative z-10 shrink-0" aria-label="ALQUDRA">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo} alt="ALQUDRA" width={166} height={40} className="h-9 w-auto sm:h-10" />
            </NavLink>

            <nav aria-label={menuLabel} className="hidden items-center gap-0.5 lg:flex">
              {nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex min-h-11 items-center px-3 text-[15px] whitespace-nowrap transition-colors duration-[160ms] xl:px-3.5 ${
                      active ? "text-paper" : "text-steel-200 hover:text-paper"
                    }`}
                  >
                    {item.label}
                    {active && <span className="absolute inset-x-3 bottom-1 h-px bg-white xl:inset-x-3.5" aria-hidden />}
                  </NavLink>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5">
              <NavLink
                href={switchHref}
                onClick={rememberLang}
                hrefLang={other}
                lang={other}
                aria-label={other === "ar" ? "العربية" : "English"}
                className="flex min-h-11 items-center rounded-[2px] px-3 font-mono text-xs font-medium tracking-[0.12em] text-steel-200 uppercase transition-colors duration-[160ms] hover:text-paper"
              >
                <span className={other === "ar" ? "font-sans text-sm tracking-normal normal-case" : ""}>{other === "ar" ? "عربي" : "EN"}</span>
              </NavLink>
              <NavLink href={`/${lang}/contact`} className="btn-accent hidden min-h-11 px-5 text-sm sm:inline-flex">
                {cta}
                <ArrowUpRight className="flip-rtl size-4" aria-hidden />
              </NavLink>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex size-11 items-center justify-center rounded-[2px] text-paper lg:hidden"
                aria-label={menuLabel}
                aria-expanded={open}
                aria-controls="mobile-menu"
              >
                {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu (outside <header> so it can cover the page) */}
      <div
        id="mobile-menu"
        className={`on-dark fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-y-auto bg-basalt-900 text-paper transition-[opacity,visibility] duration-[280ms] ease-settle lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label={menuLabel} className="container-x flex flex-col py-6">
          {nav.map((item, i) => (
            <NavLink
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              style={{ transitionDelay: open ? `${Math.min(i, 7) * 40}ms` : "0ms" }}
              className={`flex min-h-14 items-center justify-between border-b border-paper/10 text-2xl font-semibold transition-[opacity,transform] duration-[280ms] ease-settle ${
                open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              } ${isActive(item.href) ? "text-white" : "text-white/70"}`}
            >
              {item.label}
              {isActive(item.href) && <span className="fragment" aria-hidden />}
            </NavLink>
          ))}
          <NavLink href={`/${lang}/contact`} className="btn-accent mt-8">
            {cta}
            <ArrowUpRight className="flip-rtl size-4" aria-hidden />
          </NavLink>
        </nav>
      </div>
    </>
  );
}
