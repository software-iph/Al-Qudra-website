import { notFound, redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";

/** Services are part of the About page (old links to /services keep working). */
export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  redirect(`/${lang}/about#services`);
}
