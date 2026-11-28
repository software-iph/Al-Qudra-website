-- IPH endorsement wording: "A Member of IPH" (was "A member of IPH Group").
UPDATE "texts" SET "value_en" = replace("value_en", 'A member of IPH Group', 'A Member of IPH') WHERE "value_en" LIKE '%A member of IPH Group%';
--> statement-breakpoint
UPDATE "texts" SET "value_ar" = replace("value_ar", 'عضو في مجموعة IPH', 'عضو في IPH') WHERE "value_ar" LIKE '%عضو في مجموعة IPH%';
