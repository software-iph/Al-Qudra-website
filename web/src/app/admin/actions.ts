"use server";

import bcrypt from "bcryptjs";
import { and, count, eq, inArray, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { z } from "zod";
import { headers } from "next/headers";
import { createSession, destroySession, loginBlocked, loginFailed, loginSucceeded, requireUser } from "@/lib/auth";
import { findLibraryFile, libraryUsage } from "@/lib/library";
import { invalidateContent } from "@/lib/content";
import { db, schema } from "@/lib/db";
import { deleteCv, deleteUpload, isFile, saveUpload, UploadError } from "@/lib/uploads";
import { APPLICATION_STATUS } from "@/lib/status";

// ---------- helpers ----------

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const num = (fd: FormData, key: string) => Number.parseInt(str(fd, key), 10) || 0;
const bool = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "1";

/** Adds ?ok= / ?error= before any #anchor, so the page can show the message and still jump to the anchor. */
function withMessage(path: string, kind: "ok" | "error", message: string) {
  const [base, hash] = path.split("#");
  return `${base}${base.includes("?") ? "&" : "?"}${kind}=${encodeURIComponent(message)}${hash ? `#${hash}` : ""}`;
}

function done(path: string, message: string): never {
  invalidateContent();
  redirect(withMessage(path, "ok", message));
}

function fail(path: string, message: string): never {
  redirect(withMessage(path, "error", message));
}

/** Runs an upload, turning validation problems into a friendly error toast. */
async function upload(path: string, file: File, folder: string, kind: "image" | "video" = "image") {
  try {
    return await saveUpload(file, folder, kind);
  } catch (e) {
    if (e instanceof UploadError) fail(path, e.message);
    throw e;
  }
}

// ---------- auth ----------

export async function login(_prev: string | null, fd: FormData): Promise<string | null> {
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "local";
  const keys = [`email:${email}`, `ip:${ip}`];
  const wait = loginBlocked(keys);
  if (wait) return `Too many wrong attempts. Please try again in ${wait} minute${wait === 1 ? "" : "s"}.`;
  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
  // Always run bcrypt so response time does not reveal whether the email exists.
  const ok = await bcrypt.compare(password, user?.passwordHash ?? "$2b$12$TAPZgrXtPX4tceklS/DXRuhWlfeZEtTElvK6qqWGJWrW4FLGf/tzS");
  if (!user || !ok) {
    loginFailed(keys);
    return "Wrong email or password.";
  }
  loginSucceeded(keys);
  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

// ---------- texts ----------

export async function saveTexts(fd: FormData) {
  await requireUser();
  const group = str(fd, "group");
  const rows = await db.select({ key: schema.texts.key }).from(schema.texts).where(eq(schema.texts.group, group));
  for (const { key } of rows) {
    if (!fd.has(`en:${key}`)) continue;
    await db
      .update(schema.texts)
      .set({ valueEn: String(fd.get(`en:${key}`) ?? ""), valueAr: String(fd.get(`ar:${key}`) ?? "") })
      .where(eq(schema.texts.key, key));
  }
  done(`/admin/texts?group=${group}`, "Texts saved.");
}

// ---------- media (fixed photo/video spots) and the media library ----------
// Files are never deleted when a spot changes: they stay in the library to be reused.

async function mediaSlot(key: string, back: string) {
  const [item] = await db.select().from(schema.media).where(eq(schema.media.key, key));
  if (!item) fail(back, "Unknown photo/video spot.");
  return item;
}

/** Removes an uploaded file once nothing on the website uses it any more (call after the row changed). */
async function deleteIfUnused(src: string | null | undefined) {
  if (!src || (await libraryUsage()).get(src)?.length) return;
  await deleteUpload(src);
}

/** Upload a new file for a spot. */
export async function replaceMedia(fd: FormData) {
  await requireUser();
  const item = await mediaSlot(str(fd, "key"), "/admin/media");
  const file = fd.get("file");
  if (!isFile(file)) fail("/admin/media", "Please choose a file.");
  const src = await upload("/admin/media", file, "media", item.type === "video" ? "video" : "image");
  await db.update(schema.media).set({ src }).where(eq(schema.media.key, item.key));
  done("/admin/media", `"${item.label}" updated.`);
}

/** Use a file that is already in the library for a spot. */
export async function assignMedia(fd: FormData) {
  await requireUser();
  const back = str(fd, "back") === "library" ? "/admin/media#library" : "/admin/media";
  const item = await mediaSlot(str(fd, "key"), back);
  const file = await findLibraryFile(str(fd, "src"));
  if (!file) fail(back, "That file is no longer in the library.");
  if (file.type !== (item.type === "video" ? "video" : "image")) {
    fail(back, `"${item.label}" needs ${item.type === "video" ? "a video" : "a photo"}.`);
  }
  await db.update(schema.media).set({ src: file.src }).where(eq(schema.media.key, item.key));
  done(back, `"${item.label}" now uses ${file.name}.`);
}

export async function resetMedia(fd: FormData) {
  await requireUser();
  const item = await mediaSlot(str(fd, "key"), "/admin/media");
  await db.update(schema.media).set({ src: item.defaultSrc }).where(eq(schema.media.key, item.key));
  done("/admin/media", `"${item.label}" restored.`);
}

/** Add photos/videos to the library (optionally using the first one for a spot right away). */
export async function uploadToLibrary(fd: FormData) {
  await requireUser();
  const back = "/admin/media#library";
  const files = fd.getAll("files").filter(isFile);
  if (!files.length) fail(back, "Please choose at least one file.");
  const saved: string[] = [];
  for (const file of files) {
    saved.push(await upload(back, file, "media", file.type.startsWith("video/") ? "video" : "image"));
  }
  const key = str(fd, "key");
  if (key) {
    const item = await mediaSlot(key, back);
    const first = saved.find((src) => /\.(mp4|webm)$/i.test(src) === (item.type === "video"));
    if (!first) fail(back, `Uploaded, but "${item.label}" needs ${item.type === "video" ? "a video" : "a photo"}.`);
    await db.update(schema.media).set({ src: first }).where(eq(schema.media.key, item.key));
    done(back, `Uploaded and used for "${item.label}".`);
  }
  done(back, saved.length === 1 ? "File added to the library." : `${saved.length} files added to the library.`);
}

/** Delete an uploaded file from the library — only when nothing on the website uses it. */
export async function deleteLibraryFile(fd: FormData) {
  await requireUser();
  const back = "/admin/media#library";
  const file = await findLibraryFile(str(fd, "src"));
  if (!file || !file.uploaded) fail(back, "Only files uploaded from the dashboard can be deleted.");
  const where = (await libraryUsage()).get(file.src);
  if (where?.length) fail(back, `Still used in: ${where.join(", ")}.`);
  await deleteUpload(file.src);
  done(back, `${file.name} deleted.`);
}

// ---------- services ----------

export async function saveService(fd: FormData) {
  await requireUser();
  const id = num(fd, "id");
  const back = id ? `/admin/services/${id}` : "/admin/services/new";
  const values = {
    titleEn: str(fd, "titleEn"),
    titleAr: str(fd, "titleAr"),
    summaryEn: str(fd, "summaryEn"),
    summaryAr: str(fd, "summaryAr"),
    pointsEn: str(fd, "pointsEn"),
    pointsAr: str(fd, "pointsAr"),
    icon: str(fd, "icon") || "hard-hat",
    sort: num(fd, "sort"),
    active: bool(fd, "active"),
  };
  if (!values.titleEn) fail(back, "The English title is required.");

  const file = fd.get("image");
  const image = isFile(file) ? await upload(back, file, "services") : null;

  if (id) {
    const [old] = await db.select().from(schema.services).where(eq(schema.services.id, id));
    await db.update(schema.services).set({ ...values, ...(image ? { image } : {}) }).where(eq(schema.services.id, id));
    if (image) await deleteIfUnused(old?.image);
  } else {
    if (!image) fail(back, "Please choose an image.");
    await db.insert(schema.services).values({ ...values, image });
  }
  done("/admin/services", "Service saved.");
}

export async function deleteService(fd: FormData) {
  await requireUser();
  const [row] = await db.delete(schema.services).where(eq(schema.services.id, num(fd, "id"))).returning();
  await deleteIfUnused(row?.image);
  done("/admin/services", "Service deleted.");
}

// ---------- list items (values, Q³, goals, strengths, numbers) ----------

export async function saveListItem(fd: FormData) {
  await requireUser();
  const id = num(fd, "id");
  const list = str(fd, "list");
  const values = {
    list,
    titleEn: str(fd, "titleEn"),
    titleAr: str(fd, "titleAr"),
    bodyEn: str(fd, "bodyEn"),
    bodyAr: str(fd, "bodyAr"),
    icon: str(fd, "icon"),
    sort: num(fd, "sort"),
    active: bool(fd, "active"),
  };
  if (list === "stats") values.bodyAr = values.bodyEn; // numbers are the same in both languages
  if (!values.titleEn) fail(`/admin/lists?list=${list}`, "The English title is required.");
  if (id) await db.update(schema.listItems).set(values).where(eq(schema.listItems.id, id));
  else await db.insert(schema.listItems).values(values);
  done(`/admin/lists?list=${list}`, id ? "Item saved." : "Item added.");
}

export async function deleteListItem(fd: FormData) {
  await requireUser();
  const [row] = await db.delete(schema.listItems).where(eq(schema.listItems.id, num(fd, "id"))).returning();
  done(`/admin/lists?list=${row?.list ?? "values"}`, "Item deleted.");
}

// ---------- gallery ----------

export async function uploadGallery(fd: FormData) {
  await requireUser();
  const files = fd.getAll("images").filter(isFile);
  if (!files.length) fail("/admin/gallery", "Please choose at least one photo.");
  const [{ value: last }] = await db.select({ value: count() }).from(schema.gallery);
  let sort = last;
  for (const file of files) {
    const src = await upload("/admin/gallery", file, "gallery");
    await db.insert(schema.gallery).values({ src, sort: ++sort });
  }
  done("/admin/gallery", `${files.length} photo(s) added.`);
}

export async function updateGalleryItem(fd: FormData) {
  await requireUser();
  await db
    .update(schema.gallery)
    .set({ captionEn: str(fd, "captionEn"), captionAr: str(fd, "captionAr"), sort: num(fd, "sort"), active: bool(fd, "active") })
    .where(eq(schema.gallery.id, num(fd, "id")));
  done("/admin/gallery", "Photo updated.");
}

export async function deleteGalleryItem(fd: FormData) {
  await requireUser();
  const [row] = await db.delete(schema.gallery).where(eq(schema.gallery.id, num(fd, "id"))).returning();
  await deleteIfUnused(row?.src);
  done("/admin/gallery", "Photo deleted.");
}

// ---------- careers ----------

const EMPLOYMENT = ["full_time", "part_time", "contract", "internship"];
const LOCATION = ["office", "on_site", "hybrid", "remote"];

export async function saveCareer(fd: FormData) {
  await requireUser();
  const id = num(fd, "id");
  const back = id ? `/admin/careers/${id}` : "/admin/careers/new";
  const values = {
    titleEn: str(fd, "titleEn"),
    titleAr: str(fd, "titleAr"),
    descriptionEn: str(fd, "descriptionEn"),
    descriptionAr: str(fd, "descriptionAr"),
    employment: EMPLOYMENT.includes(str(fd, "employment")) ? str(fd, "employment") : "full_time",
    location: LOCATION.includes(str(fd, "location")) ? str(fd, "location") : "office",
    city: str(fd, "city"),
    departmentEn: str(fd, "departmentEn"),
    departmentAr: str(fd, "departmentAr"),
    deadline: /^\d{4}-\d{2}-\d{2}$/.test(str(fd, "deadline")) ? str(fd, "deadline") : null,
    applyMethod: str(fd, "applyMethod") === "link" ? "link" : "form",
    applyUrl: str(fd, "applyUrl"),
    active: bool(fd, "active"),
  };
  if (!values.titleEn) fail(back, "The English job title is required.");
  if (values.applyMethod === "link" && !/^https?:\/\/\S+\.\S+/i.test(values.applyUrl)) {
    fail(back, "Add the full application link (starting with https://), or choose \"Apply on the website\".");
  }
  if (id) await db.update(schema.careers).set(values).where(eq(schema.careers.id, id));
  else await db.insert(schema.careers).values(values);
  done("/admin/careers", "Job opening saved.");
}

export async function deleteCareer(fd: FormData) {
  await requireUser();
  await db.delete(schema.careers).where(eq(schema.careers.id, num(fd, "id")));
  done("/admin/careers", "Job opening deleted.");
}

// ---------- job applications ----------

export async function deleteApplication(fd: FormData) {
  await requireUser();
  const [row] = await db.delete(schema.applications).where(eq(schema.applications.id, num(fd, "id"))).returning();
  if (row) await deleteCv(row.cvFile);
  done("/admin/applications", "Application deleted.");
}

export async function setApplicationStatus(fd: FormData) {
  await requireUser();
  const id = num(fd, "id");
  const status = str(fd, "status");
  if (!(APPLICATION_STATUS as readonly string[]).includes(status)) fail(`/admin/applications/${id}`, "Unknown status.");
  await db.update(schema.applications).set({ status }).where(eq(schema.applications.id, id));
  done(`/admin/applications/${id}`, `Status set to "${status}".`);
}

export async function markApplicationUnread(fd: FormData) {
  await requireUser();
  await db.update(schema.applications).set({ readAt: null }).where(eq(schema.applications.id, num(fd, "id")));
  done("/admin/applications", "Marked as unread.");
}

// ---------- inbox ----------

export async function deleteMessage(fd: FormData) {
  await requireUser();
  await db.delete(schema.messages).where(eq(schema.messages.id, num(fd, "id")));
  done("/admin/messages", "Message deleted.");
}

export async function setMessageStatus(fd: FormData) {
  await requireUser();
  const id = num(fd, "id");
  const status = str(fd, "status") === "replied" ? "replied" : "new";
  await db.update(schema.messages).set({ status }).where(eq(schema.messages.id, id));
  done(`/admin/messages/${id}`, status === "replied" ? "Marked as replied." : "Marked as not replied.");
}

export async function markMessagesRead(fd: FormData) {
  await requireUser();
  const ids = fd.getAll("ids").map((v) => Number(v)).filter(Boolean);
  if (ids.length) await db.update(schema.messages).set({ readAt: new Date() }).where(inArray(schema.messages.id, ids));
  done("/admin/messages", "Marked as read.");
}

export async function deleteSubscriber(fd: FormData) {
  await requireUser();
  await db.delete(schema.subscribers).where(eq(schema.subscribers.id, num(fd, "id")));
  done("/admin/subscribers", "Subscriber removed.");
}

// ---------- settings ----------

export async function saveSettings(fd: FormData) {
  await requireUser();
  const rows = await db.select().from(schema.settings);
  for (const row of rows) {
    if (!fd.has(row.key)) continue;
    const value = str(fd, row.key);
    if (value && row.type === "email" && !z.email().safeParse(value).success) fail("/admin/settings", `"${row.label}" is not a valid email.`);
    if (value && row.type === "url" && !/^https?:\/\//i.test(value)) fail("/admin/settings", `"${row.label}" must start with https://`);
    await db.update(schema.settings).set({ value }).where(eq(schema.settings.key, row.key));
  }
  done("/admin/settings", "Settings saved.");
}

// ---------- users ----------

const passwordRule = z.string().min(10, "Passwords need at least 10 characters.");

export async function addUser(fd: FormData) {
  await requireUser();
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!str(fd, "name") || !email) fail("/admin/users", "Name and email are required.");
  const check = passwordRule.safeParse(password);
  if (!check.success) fail("/admin/users", check.error.issues[0].message);
  const [exists] = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.email, email));
  if (exists) fail("/admin/users", "A user with this email already exists.");
  await db.insert(schema.users).values({ name: str(fd, "name"), email, passwordHash: await bcrypt.hash(password, 12) });
  done("/admin/users", "User added.");
}

export async function deleteUser(fd: FormData) {
  const me = await requireUser();
  const id = num(fd, "id");
  if (id === me.id) fail("/admin/users", "You cannot delete your own account.");
  await db.delete(schema.users).where(and(eq(schema.users.id, id), ne(schema.users.id, me.id)));
  done("/admin/users", "User deleted.");
}

export async function changePassword(fd: FormData) {
  const me = await requireUser();
  const [user] = await db.select().from(schema.users).where(eq(schema.users.id, me.id));
  if (!(await bcrypt.compare(String(fd.get("current") ?? ""), user.passwordHash))) fail("/admin/users", "Your current password is wrong.");
  const next = String(fd.get("password") ?? "");
  const check = passwordRule.safeParse(next);
  if (!check.success) fail("/admin/users", check.error.issues[0].message);
  if (next !== String(fd.get("confirm") ?? "")) fail("/admin/users", "The new passwords do not match.");
  await db.update(schema.users).set({ passwordHash: await bcrypt.hash(next, 12) }).where(eq(schema.users.id, me.id));
  done("/admin/users", "Password changed.");
}
