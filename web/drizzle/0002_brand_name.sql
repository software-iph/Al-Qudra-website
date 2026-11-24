-- Brand identity (Nov 2026): the company is written "ALQUDRA" in running text,
-- and its full name is "ALQUDRA — Aldaema for Engineering Consultations"
-- (Arabic: "القدرة الدائمة للاستشارات الهندسية"). Runs once; later dashboard edits are kept.
UPDATE "texts" SET
  "value_en" = replace(replace("value_en", 'Al-Qudra for Engineering Consultancy and Services', 'ALQUDRA — Aldaema for Engineering Consultations'), 'Al-Qudra', 'ALQUDRA'),
  "value_ar" = replace("value_ar", 'شركة القدرة للاستشارات والخدمات الهندسية', 'القدرة الدائمة للاستشارات الهندسية');
--> statement-breakpoint
UPDATE "list_items" SET
  "title_en" = replace("title_en", 'Al-Qudra', 'ALQUDRA'),
  "body_en" = replace("body_en", 'Al-Qudra', 'ALQUDRA');
--> statement-breakpoint
UPDATE "services" SET
  "summary_en" = replace("summary_en", 'Al-Qudra', 'ALQUDRA'),
  "points_en" = replace("points_en", 'Al-Qudra', 'ALQUDRA');
--> statement-breakpoint
UPDATE "media" SET "src" = '/brand/logo-ink.png' WHERE "key" = 'brand.logo_dark' AND "src" = '/brand/logo-navy.png';
--> statement-breakpoint
UPDATE "media" SET "src" = '/brand/logo-paper.png' WHERE "key" = 'brand.logo_light' AND "src" = '/brand/logo-white.png';
