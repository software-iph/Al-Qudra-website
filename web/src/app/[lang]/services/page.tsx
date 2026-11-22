import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  return { title: lang === "ar" ? "خدماتنا" : "Services" };
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  redirect(`/${lang}/about#services`);
}
