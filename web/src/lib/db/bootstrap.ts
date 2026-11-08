import path from "node:path";
import bcrypt from "bcryptjs";
import { count, sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, schema } from "./index";
import { LISTS, MEDIA, SERVICES, SETTINGS, TEXTS, TEXT_GROUPS } from "../seed-data";

/**
 * Runs once when the server starts: applies database migrations, then adds any
 * missing first-run content. Existing rows (anything edited in the dashboard)
 * are never overwritten; labels and ordering are refreshed.
 */
export async function bootstrap() {
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  await seed();
}

async function seed() {
  const groups = Object.keys(TEXT_GROUPS);

  await db
    .insert(schema.texts)
    .values(
      TEXTS.map(([key, label, type, valueEn, valueAr], i) => ({
        key,
        group: key.split(".")[0],
        label,
        type,
        valueEn,
        valueAr,
        sort: (groups.indexOf(key.split(".")[0]) + 1) * 1000 + i,
      })),
    )
    .onConflictDoUpdate({
      target: schema.texts.key,
      set: { label: sql`excluded.label`, type: sql`excluded.type`, group: sql`excluded.group`, sort: sql`excluded.sort` },
    });

  await db
    .insert(schema.media)
    .values(MEDIA.map(([key, group, label, type, src], i) => ({ key, group, label, type, src, defaultSrc: src, sort: i })))
    .onConflictDoUpdate({
      target: schema.media.key,
      set: {
        label: sql`excluded.label`,
        group: sql`excluded.group`,
        type: sql`excluded.type`,
        // Slots never replaced in the dashboard follow a new default file; uploads are kept.
        src: sql`case when ${schema.media.src} = ${schema.media.defaultSrc} then excluded.default_src else ${schema.media.src} end`,
        defaultSrc: sql`excluded.default_src`,
        sort: sql`excluded.sort`,
      },
    });

  await db
    .insert(schema.settings)
    .values(SETTINGS.map(([key, group, label, type, value], i) => ({ key, group, label, type, value, sort: i })))
    .onConflictDoUpdate({
      target: schema.settings.key,
      set: { label: sql`excluded.label`, group: sql`excluded.group`, type: sql`excluded.type`, sort: sql`excluded.sort` },
    });

  // Collections are only filled on the very first run.
  const [{ value: listCount }] = await db.select({ value: count() }).from(schema.listItems);
  if (listCount === 0) {
    await db.insert(schema.listItems).values(
      Object.entries(LISTS).flatMap(([list, { items }]) => items.map((item, i) => ({ list, ...item, sort: i + 1 }))),
    );
  }

  const [{ value: serviceCount }] = await db.select({ value: count() }).from(schema.services);
  if (serviceCount === 0) {
    await db.insert(schema.services).values(SERVICES.map((s, i) => ({ ...s, sort: i + 1 })));
  }

  const [{ value: galleryCount }] = await db.select({ value: count() }).from(schema.gallery);
  if (galleryCount === 0) {
    await db.insert(schema.gallery).values(
      Array.from({ length: 27 }, (_, i) => ({ src: `/images/gallery/${String(i + 1).padStart(2, "0")}.jpg`, sort: i + 1 })),
    );
  }

  const [{ value: userCount }] = await db.select({ value: count() }).from(schema.users);
  if (userCount === 0) {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (email && password) {
      await db.insert(schema.users).values({
        name: process.env.ADMIN_NAME?.trim() || "Admin",
        email,
        passwordHash: await bcrypt.hash(password, 12),
      });
      console.log(`[alqudra] Created the first dashboard user (${email}).`);
    } else {
      console.warn("[alqudra] No dashboard user yet. Set ADMIN_EMAIL and ADMIN_PASSWORD and restart to create one.");
    }
  }
}
