import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const HEADER_TITLE = "Se former sur l'autisme et les troubles du neurodéveloppement"
const HEADER_DESCRIPTION =
  "Des formations fiables, répondant aux recommandations de bonnes pratiques professionnelles, sélectionnées par une commission d'experts, pour les personnes concernées, les proches et les professionnels."

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "courses_page_selection_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "courses_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"platforms_title" varchar NOT NULL,
  	"platforms_description" varchar NOT NULL,
  	"platforms_featured_badge" varchar,
  	"platforms_featured_title" varchar NOT NULL,
  	"platforms_featured_description" varchar NOT NULL,
  	"platforms_featured_image_id" integer,
  	"platforms_featured_link_label" varchar NOT NULL,
  	"platforms_featured_link_url" varchar NOT NULL,
  	"platforms_left_badge" varchar,
  	"platforms_left_title" varchar NOT NULL,
  	"platforms_left_description" varchar NOT NULL,
  	"platforms_left_image_id" integer,
  	"platforms_left_link_label" varchar NOT NULL,
  	"platforms_left_link_url" varchar NOT NULL,
  	"platforms_right_badge" varchar,
  	"platforms_right_title" varchar NOT NULL,
  	"platforms_right_description" varchar NOT NULL,
  	"platforms_right_image_id" integer,
  	"platforms_right_link_label" varchar NOT NULL,
  	"platforms_right_link_url" varchar NOT NULL,
  	"selection_title" varchar NOT NULL,
  	"selection_description" varchar NOT NULL,
  	"selection_link_label" varchar,
  	"selection_link_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "courses_page" ADD COLUMN IF NOT EXISTS "header_title" varchar;
  ALTER TABLE "courses_page" ADD COLUMN IF NOT EXISTS "header_description" varchar;
  ALTER TABLE "courses_page" ADD COLUMN IF NOT EXISTS "header_image_id" integer;
  ALTER TABLE "courses_page" ADD COLUMN IF NOT EXISTS "header_primary_link_label" varchar;
  ALTER TABLE "courses_page" ADD COLUMN IF NOT EXISTS "header_primary_link_url" varchar;
  ALTER TABLE "courses_page" ADD COLUMN IF NOT EXISTS "header_secondary_link_label" varchar;
  ALTER TABLE "courses_page" ADD COLUMN IF NOT EXISTS "header_secondary_link_url" varchar;`)

  await db.execute(sql`
   UPDATE "courses_page" SET
    "header_title" = ${HEADER_TITLE},
    "header_description" = ${HEADER_DESCRIPTION},
    "header_primary_link_label" = 'Les formations',
    "header_primary_link_url" = '/formations',
    "header_secondary_link_label" = 'Critères de sélection',
    "header_secondary_link_url" = '/formations'
   WHERE "header_title" IS NULL`)

  await db.execute(sql`
   ALTER TABLE "courses_page" ALTER COLUMN "header_title" SET NOT NULL;
  ALTER TABLE "courses_page" ALTER COLUMN "header_description" SET NOT NULL;
  ALTER TABLE "courses_page" ALTER COLUMN "header_primary_link_label" SET NOT NULL;
  ALTER TABLE "courses_page" ALTER COLUMN "header_primary_link_url" SET NOT NULL;

  DO $$ BEGIN
    ALTER TABLE "courses_page_selection_steps" ADD CONSTRAINT "courses_page_selection_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_page"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "courses_page" ADD CONSTRAINT "courses_page_header_image_id_medias_id_fk" FOREIGN KEY ("header_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "courses_page" ADD CONSTRAINT "courses_page_platforms_featured_image_id_medias_id_fk" FOREIGN KEY ("platforms_featured_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "courses_page" ADD CONSTRAINT "courses_page_platforms_left_image_id_medias_id_fk" FOREIGN KEY ("platforms_left_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "courses_page" ADD CONSTRAINT "courses_page_platforms_right_image_id_medias_id_fk" FOREIGN KEY ("platforms_right_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "courses_page_selection_steps_order_idx" ON "courses_page_selection_steps" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "courses_page_selection_steps_parent_id_idx" ON "courses_page_selection_steps" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "courses_page_header_header_image_idx" ON "courses_page" USING btree ("header_image_id");
  CREATE INDEX IF NOT EXISTS "courses_page_platforms_featured_platforms_featured_image_idx" ON "courses_page" USING btree ("platforms_featured_image_id");
  CREATE INDEX IF NOT EXISTS "courses_page_platforms_left_platforms_left_image_idx" ON "courses_page" USING btree ("platforms_left_image_id");
  CREATE INDEX IF NOT EXISTS "courses_page_platforms_right_platforms_right_image_idx" ON "courses_page" USING btree ("platforms_right_image_id");

  ALTER TABLE "menu" ALTER COLUMN "locked_items_courses_title" SET DEFAULT 'Me former';
  UPDATE "menu" SET "locked_items_courses_title" = 'Me former' WHERE "locked_items_courses_title" IN ('Formations', 'Se former');`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "menu" SET "locked_items_courses_title" = 'Formations' WHERE "locked_items_courses_title" = 'Me former';
  ALTER TABLE "menu" ALTER COLUMN "locked_items_courses_title" SET DEFAULT 'Formations';
  DROP TABLE IF EXISTS "courses_page_selection_steps" CASCADE;
  DROP TABLE IF EXISTS "courses_page" CASCADE;`)
}
