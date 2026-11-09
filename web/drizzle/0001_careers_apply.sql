CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"career_id" integer,
	"job_title" varchar(200) DEFAULT '' NOT NULL,
	"name" varchar(150) NOT NULL,
	"email" varchar(200) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"city" varchar(100) DEFAULT '' NOT NULL,
	"link" varchar(300) DEFAULT '' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"cv_file" text NOT NULL,
	"cv_name" varchar(255) NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "careers" ALTER COLUMN "location" SET DEFAULT 'office';--> statement-breakpoint
ALTER TABLE "careers" ADD COLUMN "apply_method" varchar(10) DEFAULT 'form' NOT NULL;--> statement-breakpoint
ALTER TABLE "careers" ADD COLUMN "apply_url" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_career_id_careers_id_fk" FOREIGN KEY ("career_id") REFERENCES "public"."careers"("id") ON DELETE set null ON UPDATE no action;