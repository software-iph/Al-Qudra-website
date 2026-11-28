import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.SITE_URL ?? "https://www.alqudra-ec.com").replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/uploads/private"] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
