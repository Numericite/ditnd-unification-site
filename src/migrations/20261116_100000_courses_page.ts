import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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
  
  DO $$ BEGIN
    ALTER TABLE "courses_page_selection_steps" ADD CONSTRAINT "courses_page_selection_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."courses_page"("id") ON DELETE cascade ON UPDATE no action;
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
  CREATE INDEX IF NOT EXISTS "courses_page_platforms_featured_platforms_featured_image_idx" ON "courses_page" USING btree ("platforms_featured_image_id");
  CREATE INDEX IF NOT EXISTS "courses_page_platforms_left_platforms_left_image_idx" ON "courses_page" USING btree ("platforms_left_image_id");
  CREATE INDEX IF NOT EXISTS "courses_page_platforms_right_platforms_right_image_idx" ON "courses_page" USING btree ("platforms_right_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "courses_page_selection_steps" CASCADE;
  DROP TABLE IF EXISTS "courses_page" CASCADE;`)
}
