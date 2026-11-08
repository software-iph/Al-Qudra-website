import type { Metadata, Viewport } from "next";
import { Almarai } from "next/font/google";
import { notFound } from "next/navigation";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MotionProvider } from "@/components/site/Motion";
import { getContent } from "@/lib/content";
import { dir, isLocale } from "@/lib/i18n";
import "../globals.css";

const almarai = Almarai({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "700", "800"],
  variable: "--font-almarai",
  display: "swap",
});

export const viewport: Viewport = { themeColor: "#0b1c30" };

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const ar = lang === "ar";
  const name = ar ? "شركة القدرة للاستشارات الهندسية" : "Al-Qudra Engineering Consultancy";
  return {
    metadataBase: new URL(process.env.SITE_URL ?? "https://www.alqudra-ec.com"),
    title: { default: name, template: `%s | ${ar ? "القدرة" : "Al-Qudra"}` },
    description: ar
      ? "إشراف هندسي ومراجعة فنية وضبط جودة وحوكمة هندسية للمشاريع الاستراتيجية والبنية التحتية في ليبيا."
      : "Engineering supervision, technical review, quality control and engineering governance for strategic projects and infrastructure in Libya.",
    alternates: { languages: { ar: "/ar", en: "/en" } },
    openGraph: { siteName: name, type: "website", images: ["/images/approach-1.webp"] },
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getContent(lang);

  const nav = [
    { href: `/${lang}`, label: c.t("nav.home") },
    { href: `/${lang}/about`, label: c.t("nav.about") },
    { href: `/${lang}/services`, label: c.t("nav.services") },
    { href: `/${lang}/careers`, label: c.t("nav.careers") },
    { href: `/${lang}/gallery`, label: c.t("nav.gallery") },
    { href: `/${lang}/contact`, label: c.t("nav.contact") },
  ];

  return (
    <html lang={lang} dir={dir(lang)} className={almarai.variable}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
          {lang === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}
        </a>
        <Header
          lang={lang}
          logoLight={c.media("brand.logo_light")}
          logoDark={c.media("brand.logo_dark")}
          nav={nav}
          cta={c.t("nav.cta")}
        />
        <MotionProvider>
          <main id="main">{children}</main>
        </MotionProvider>
        <Footer c={c} nav={nav} />
      </body>
    </html>
  );
}
