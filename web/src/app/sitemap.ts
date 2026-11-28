import type { MetadataRoute } from "next";

const PAGES = ["", "/about", "/careers", "/gallery", "/contact", "/privacy"];

/** sitemap.xml: every public page in both languages, linked to each other (IPH C3). */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.SITE_URL ?? "https://www.alqudra-ec.com").replace(/\/$/, "");
  return PAGES.flatMap((page) =>
    (["ar", "en"] as const).map((lang) => ({
      url: `${base}/${lang}${page}`,
      changeFrequency: page === "/careers" ? ("weekly" as const) : ("monthly" as const),
      priority: page === "" ? 1 : 0.7,
      alternates: { languages: { ar: `${base}/ar${page}`, en: `${base}/en${page}` } },
    })),
  );
}
