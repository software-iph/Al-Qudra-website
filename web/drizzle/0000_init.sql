CREATE TABLE "careers" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_ar" varchar(200) DEFAULT '' NOT NULL,
	"description_en" text DEFAULT '' NOT NULL,
	"description_ar" text DEFAULT '' NOT NULL,
	"employment" varchar(20) DEFAULT 'full_time' NOT NULL,
	"location" varchar(20) DEFAULT 'on_site' NOT NULL,
	"city" varchar(100) DEFAULT '' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery" (
	"id" serial PRIMARY KEY NOT NULL,
	"src" text NOT NULL,
	"caption_en" varchar(255) DEFAULT '' NOT NULL,
	"caption_ar" varchar(255) DEFAULT '' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "list_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"list" varchar(30) NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_ar" varchar(200) DEFAULT '' NOT NULL,
	"body_en" text DEFAULT '' NOT NULL,
	"body_ar" text DEFAULT '' NOT NULL,
	"icon" varchar(40) DEFAULT '' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"key" varchar(120) PRIMARY KEY NOT NULL,
	"group" varchar(60) NOT NULL,
	"label" varchar(200) NOT NULL,
	"type" varchar(20) DEFAULT 'image' NOT NULL,
	"src" text NOT NULL,
	"default_src" text NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"email" varchar(200) NOT NULL,
	"phone" varchar(50) DEFAULT '' NOT NULL,
	"subject" varchar(200) DEFAULT '' NOT NULL,
	"message" text NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" varchar(200) NOT NULL,
	"title_ar" varchar(200) DEFAULT '' NOT NULL,
	"summary_en" text DEFAULT '' NOT NULL,
	"summary_ar" text DEFAULT '' NOT NULL,
	"points_en" text DEFAULT '' NOT NULL,
	"points_ar" text DEFAULT '' NOT NULL,
	"image" text DEFAULT '' NOT NULL,
	"icon" varchar(40) DEFAULT 'hard-hat' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" varchar(120) PRIMARY KEY NOT NULL,
	"group" varchar(60) NOT NULL,
	"label" varchar(200) NOT NULL,
	"type" varchar(20) DEFAULT 'text' NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(200) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "texts" (
	"key" varchar(120) PRIMARY KEY NOT NULL,
	"group" varchar(60) NOT NULL,
	"label" varchar(200) NOT NULL,
	"type" varchar(20) DEFAULT 'text' NOT NULL,
	"value_en" text DEFAULT '' NOT NULL,
	"value_ar" text DEFAULT '' NOT NULL,
	"sort" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(150) NOT NULL,
	"email" varchar(200) NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
