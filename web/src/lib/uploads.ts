import { randomBytes } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/** Dashboard uploads live in ./uploads next to the app (a Docker volume in production). */
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");

const RULES = {
  image: { types: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"], maxMb: 10 },
  video: { types: ["video/mp4", "video/webm"], maxMb: 100 },
} as const;

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export class UploadError extends Error {}

export function isFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

/** Saves an uploaded file and returns its public URL (/uploads/...). */
export async function saveUpload(file: File, folder: string, kind: keyof typeof RULES = "image") {
  const rule = RULES[kind];
  if (!(rule.types as readonly string[]).includes(file.type)) {
    throw new UploadError(kind === "video" ? "Please upload an MP4 or WebM video." : "Please upload a JPG, PNG, WebP, GIF or AVIF image.");
  }
  if (file.size > rule.maxMb * 1024 * 1024) {
    throw new UploadError(`The file is too large (max ${rule.maxMb} MB).`);
  }

  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "");
  const name = `${Date.now()}-${randomBytes(5).toString("hex")}.${EXT[file.type]}`;
  const dir = path.join(UPLOAD_DIR, safeFolder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${safeFolder}/${name}`;
}

/** Deletes a file previously uploaded through the dashboard. Bundled defaults are never touched. */
export async function deleteUpload(src: string | null | undefined) {
  if (!src || !src.startsWith("/uploads/")) return;
  const target = path.resolve(UPLOAD_DIR, src.slice("/uploads/".length));
  if (!target.startsWith(UPLOAD_DIR + path.sep)) return;
  await unlink(target).catch(() => undefined);
}
