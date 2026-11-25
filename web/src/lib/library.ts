import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { db, schema } from "./db";
import { UPLOAD_DIR } from "./uploads";

/**
 * The media library: every photo and video the website can use —
 * files that ship with the site (public/images, public/videos) and files
 * uploaded from the dashboard (uploads/, except the private CV folder).
 */
export type LibraryFile = {
  src: string; // public URL, e.g. /images/building.jpg or /uploads/media/123.webp
  name: string;
  type: "image" | "video";
  uploaded: boolean; // true = uploaded from the dashboard (can be deleted when unused)
  size: number;
  time: number;
};

const IMAGE = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const VIDEO = new Set([".mp4", ".webm"]);
// Optimised copies made for the bundled videos/posters; the library shows the main file only.
const HIDDEN = /(-720\.mp4|\.webm|-poster\.webp)$/i;

const PUBLIC_DIR = path.join(process.cwd(), "public");

async function walk(dir: string, urlBase: string, uploaded: boolean, out: LibraryFile[]) {
  const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const url = `${urlBase}/${e.name}`;
    if (e.isDirectory()) {
      if (uploaded && urlBase === "/uploads" && e.name === "private") continue; // CVs never appear here
      await walk(full, url, uploaded, out);
      continue;
    }
    const ext = path.extname(e.name).toLowerCase();
    const type = IMAGE.has(ext) ? "image" : VIDEO.has(ext) ? "video" : null;
    if (!type || (!uploaded && HIDDEN.test(e.name))) continue;
    const info = await stat(full).catch(() => null);
    if (!info) continue;
    out.push({ src: url, name: e.name, type, uploaded, size: info.size, time: info.mtimeMs });
  }
}

export async function listLibrary(): Promise<LibraryFile[]> {
  const files: LibraryFile[] = [];
  await walk(path.join(PUBLIC_DIR, "images"), "/images", false, files);
  await walk(path.join(PUBLIC_DIR, "videos"), "/videos", false, files);
  await walk(UPLOAD_DIR, "/uploads", true, files);
  // Newest uploads first, then the bundled files by name.
  return files.sort((a, b) => Number(b.uploaded) - Number(a.uploaded) || b.time - a.time || a.name.localeCompare(b.name));
}

/** Where each file is used on the website (media slots, gallery, services). */
export async function libraryUsage(): Promise<Map<string, string[]>> {
  const [media, gallery, services] = await Promise.all([
    db.select({ src: schema.media.src, label: schema.media.label, group: schema.media.group }).from(schema.media),
    db.select({ src: schema.gallery.src }).from(schema.gallery),
    db.select({ src: schema.services.image, title: schema.services.titleEn }).from(schema.services),
  ]);
  const used = new Map<string, string[]>();
  const add = (src: string, where: string) => used.set(src, [...(used.get(src) ?? []), where]);
  for (const m of media) add(m.src, `${m.group}: ${m.label}`);
  for (const g of gallery) add(g.src, "Gallery");
  for (const s of services) if (s.src) add(s.src, `Service: ${s.title}`);
  return used;
}

/** Finds a library file by URL (used to validate choices sent from the dashboard). */
export async function findLibraryFile(src: string) {
  return (await listLibrary()).find((f) => f.src === src) ?? null;
}
