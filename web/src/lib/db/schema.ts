import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/** Every text on the public website, in English and Arabic. */
export const texts = pgTable("texts", {
  key: varchar("key", { length: 120 }).primaryKey(), // e.g. "home.hero_title"
  group: varchar("group", { length: 60 }).notNull(),
  label: varchar("label", { length: 200 }).notNull(),
  type: varchar("type", { length: 20 }).notNull().default("text"), // text | textarea | list
  valueEn: text("value_en").notNull().default(""),
  valueAr: text("value_ar").notNull().default(""),
  sort: integer("sort").notNull().default(0),
});

/** Fixed image / video slots on the website (logo, hero video, section photos...). */
export const media = pgTable("media", {
  key: varchar("key", { length: 120 }).primaryKey(),
  group: varchar("group", { length: 60 }).notNull(),
  label: varchar("label", { length: 200 }).notNull(),
  type: varchar("type", { length: 20 }).notNull().default("image"), // image | video
  src: text("src").notNull(),
  defaultSrc: text("default_src").notNull(),
  sort: integer("sort").notNull().default(0),
});

/** Single values: phone, emails, social links, map link. */
export const settings = pgTable("settings", {
  key: varchar("key", { length: 120 }).primaryKey(),
  group: varchar("group", { length: 60 }).notNull(),
  label: varchar("label", { length: 200 }).notNull(),
  type: varchar("type", { length: 20 }).notNull().default("text"), // text | email | url | phone
  value: text("value").notNull().default(""),
  sort: integer("sort").notNull().default(0),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  titleEn: varchar("title_en", { length: 200 }).notNull(),
  titleAr: varchar("title_ar", { length: 200 }).notNull().default(""),
  summaryEn: text("summary_en").notNull().default(""),
  summaryAr: text("summary_ar").notNull().default(""),
  pointsEn: text("points_en").notNull().default(""), // one per line
  pointsAr: text("points_ar").notNull().default(""),
  image: text("image").notNull().default(""),
  icon: varchar("icon", { length: 40 }).notNull().default("hard-hat"),
  sort: integer("sort").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

/**
 * Repeating items shown as cards: core values, Q³ pillars, strategic goals,
 * "what sets us apart", headline numbers.
 */
export const listItems = pgTable("list_items", {
  id: serial("id").primaryKey(),
  list: varchar("list", { length: 30 }).notNull(), // values | q3 | goals | strengths | stats
  titleEn: varchar("title_en", { length: 200 }).notNull(),
  titleAr: varchar("title_ar", { length: 200 }).notNull().default(""),
  bodyEn: text("body_en").notNull().default(""),
  bodyAr: text("body_ar").notNull().default(""),
  icon: varchar("icon", { length: 40 }).notNull().default(""),
  sort: integer("sort").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const gallery = pgTable("gallery", {
  id: serial("id").primaryKey(),
  src: text("src").notNull(),
  captionEn: varchar("caption_en", { length: 255 }).notNull().default(""),
  captionAr: varchar("caption_ar", { length: 255 }).notNull().default(""),
  sort: integer("sort").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const careers = pgTable("careers", {
  id: serial("id").primaryKey(),
  titleEn: varchar("title_en", { length: 200 }).notNull(),
  titleAr: varchar("title_ar", { length: 200 }).notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  descriptionAr: text("description_ar").notNull().default(""),
  employment: varchar("employment", { length: 20 }).notNull().default("full_time"), // full_time | part_time | contract | internship
  location: varchar("location", { length: 20 }).notNull().default("on_site"), // on_site | remote | hybrid
  city: varchar("city", { length: 100 }).notNull().default(""),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull().default(""),
  subject: varchar("subject", { length: 200 }).notNull().default(""),
  message: text("message").notNull(),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
