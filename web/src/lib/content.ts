import { asc, eq } from "drizzle-orm";
import { connection } from "next/server";
import { db, schema } from "./db";
import type { Locale } from "./i18n";

export type ListItem = { id: number; title: string; body: string; icon: string };
export type ServiceItem = { id: number; title: string; summary: string; points: string[]; image: string; icon: string };
export type GalleryItem = { id: number; src: string; caption: string };

type Raw = Awaited<ReturnType<typeof load>>;

const TTL_MS = 60_000;

declare global {
  var __alqudraContent: { at: number; data: Raw } | undefined;
}

/** Clears the cached website content (called after every dashboard change). */
export function invalidateContent() {
  globalThis.__alqudraContent = undefined;
}

async function load() {
  const [texts, media, settings, lists, services, gallery] = await Promise.all([
    db.select().from(schema.texts),
    db.select().from(schema.media),
    db.select().from(schema.settings),
    db.select().from(schema.listItems).where(eq(schema.listItems.active, true)).orderBy(asc(schema.listItems.sort), asc(schema.listItems.id)),
    db.select().from(schema.services).where(eq(schema.services.active, true)).orderBy(asc(schema.services.sort), asc(schema.services.id)),
    db.select().from(schema.gallery).where(eq(schema.gallery.active, true)).orderBy(asc(schema.gallery.sort), asc(schema.gallery.id)),
  ]);
  return { texts, media, settings, lists, services, gallery };
}

async function raw(): Promise<Raw> {
  const cached = globalThis.__alqudraContent;
  if (cached && Date.now() - cached.at < TTL_MS) return cached.data;
  const data = await load();
  globalThis.__alqudraContent = { at: Date.now(), data };
  return data;
}

export const lines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

/** Everything a public page needs, already in the visitor's language. */
export async function getContent(lang: Locale) {
  await connection(); // always render with the latest content
  const data = await raw();
  const ar = lang === "ar";
  const pick = (en: string, arValue: string) => (ar && arValue.trim() ? arValue : en);

  const textMap = new Map(data.texts.map((row) => [row.key, pick(row.valueEn, row.valueAr)]));
  const mediaMap = new Map(data.media.map((row) => [row.key, row.src || row.defaultSrc]));
  const settingMap = new Map(data.settings.map((row) => [row.key, row.value]));

  const toItem = (row: (typeof data.lists)[number]): ListItem => ({
    id: row.id,
    title: pick(row.titleEn, row.titleAr),
    body: pick(row.bodyEn, row.bodyAr),
    icon: row.icon,
  });

  return {
    lang,
    t: (key: string) => textMap.get(key) ?? "",
    list: (key: string) => lines(textMap.get(key) ?? ""),
    media: (key: string) => mediaMap.get(key) ?? "",
    setting: (key: string) => settingMap.get(key) ?? "",
    items: (list: string) => data.lists.filter((row) => row.list === list).map(toItem),
    services: data.services.map(
      (s): ServiceItem => ({
        id: s.id,
        title: pick(s.titleEn, s.titleAr),
        summary: pick(s.summaryEn, s.summaryAr),
        points: lines(pick(s.pointsEn, s.pointsAr)),
        image: s.image,
        icon: s.icon,
      }),
    ),
    gallery: data.gallery.map((g): GalleryItem => ({ id: g.id, src: g.src, caption: pick(g.captionEn, g.captionAr) })),
  };
}

export type Content = Awaited<ReturnType<typeof getContent>>;
