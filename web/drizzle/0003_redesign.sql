ALTER TABLE "applications" ADD COLUMN "status" varchar(20) DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE "careers" ADD COLUMN "department_en" varchar(120) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "careers" ADD COLUMN "department_ar" varchar(120) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "careers" ADD COLUMN "deadline" date;--> statement-breakpoint
ALTER TABLE "messages" ADD COLUMN "status" varchar(20) DEFAULT 'new' NOT NULL;--> statement-breakpoint
-- IPH Website Standards (Must #1): the hero headline says what the company does and where.
-- Only replaces the old default; a headline already edited in the dashboard is kept.
UPDATE "texts" SET
  "value_en" = 'Engineering supervision, technical review and quality control across Libya.',
  "value_ar" = 'إشراف هندسي ومراجعة فنية وضبط جودة في جميع أنحاء ليبيا.'
WHERE "key" = 'home.hero_title' AND "value_en" = 'Precision, governance and quality on every project.';
--> statement-breakpoint
-- CVs are limited to 5 MB (IPH Requirements Guide, section 5).
UPDATE "texts" SET
  "value_en" = replace("value_en", 'up to 10 MB', 'up to 5 MB'),
  "value_ar" = replace("value_ar", 'حتى 10 ميغابايت', 'حتى 5 ميغابايت')
WHERE "key" IN ('careers.form_cv', 'careers.form_cv_invalid');
--> statement-breakpoint
-- Applications already opened in the dashboard count as reviewed.
UPDATE "applications" SET "status" = 'reviewed' WHERE "read_at" IS NOT NULL AND "status" = 'new';
