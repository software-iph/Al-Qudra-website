import type { Metadata, Viewport } from "next";
import { Almarai } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MotionProvider } from "@/components/site/Motion";
import { RouteCurtain } from "@/components/site/RouteCurtain";
import { getContent } from "@/lib/content";
import { dir, isLocale } from "@/lib/i18n";
import "../globals.css";

// ALQUDRA identity typography (Brand Guidelines P:4.1-4.2): Almarai for English, Thmanyah Sans for Arabic.
const almarai = Almarai({ subsets: ["arabic", "latin"], weight: ["300", "400", "700", "800"], variable: "--font-almarai", display: "swap" });
// Thmanyah Sans, the identity's Arabic face (see src/fonts/thmanyah/README.md for the licence terms).
// Bundled by next/font (hashed assets, not a public download path). Not preloaded, because English
// pages never use it; Arabic pages swap to it as soon as it arrives.
const thmanyah = localFont({
  src: [
    { path: "../../fonts/thmanyah/thmanyahsans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../fonts/thmanyah/thmanyahsans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../fonts/thmanyah/thmanyahsans-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../fonts/thmanyah/thmanyahsans-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-thmanyah",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const viewport: Viewport = { themeColor: "#0c1d2b" };

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const ar = lang === "ar";
  const name = ar ? "القدرة الدائمة للاستشارات الهندسية" : "ALQUDRA — Aldaema for Engineering Consultations";
  return {
    metadataBase: new URL(process.env.SITE_URL ?? "https://www.alqudra-ec.com"),
    title: { default: name, template: `%s | ${ar ? "القدرة" : "ALQUDRA"}` },
    description: ar
      ? "إشراف هندسي ومراجعة فنية وضبط جودة وحوكمة هندسية للمشاريع الاستراتيجية والبنية التحتية في ليبيا."
      : "Engineering supervision, technical review, quality control and engineering governance for strategic projects and infrastructure in Libya.",
    alternates: { languages: { ar: "/ar", en: "/en" } },
    openGraph: { siteName: name, type: "website", locale: ar ? "ar_LY" : "en_GB", images: ["/images/hero-3d.jpg"] },
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);

  // Menu: Home · About · Careers · Gallery · Contact. Services live on the About page (/about#services).
  // No Projects page: ALQUDRA's projects are confidential.
  const nav = [
    { href: `/${lang}`, label: c.t("nav.home") },
    { href: `/${lang}/about`, label: c.t("nav.about") },
    { href: `/${lang}/careers`, label: c.t("nav.careers") },
    { href: `/${lang}/gallery`, label: c.t("nav.gallery") },
    { href: `/${lang}/contact`, label: c.t("nav.contact") },
  ];

  return (
    <html lang={lang} dir={dir(lang)} className={`${almarai.variable} ${thmanyah.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-3 focus:top-3 focus:z-[60] focus:rounded-[2px] focus:bg-paper focus:px-4 focus:py-3 focus:font-medium"
        >
          {c.t("nav.skip")}
        </a>
        <Header lang={lang} logo={c.media("brand.logo_light")} nav={nav} cta={c.t("nav.contact")} menuLabel={c.t("nav.menu")} />
        <MotionProvider>
          <main id="main">{children}</main>
        </MotionProvider>
        <Footer c={c} nav={nav} />
        <RouteCurtain />
      </body>
    </html>
  );
}
