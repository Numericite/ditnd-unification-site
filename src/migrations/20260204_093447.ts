import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "practical_guide_vectors" (
  	"id" integer PRIMARY KEY NOT NULL,
  	"doc_id" text NOT NULL,
  	"chunk_index" integer NOT NULL,
  	"text" text NOT NULL,
  	"embedding" vector(384) NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_title" varchar NOT NULL,
  	"header_description" varchar NOT NULL,
  	"tiles_description" varchar NOT NULL,
  	"most_viewed_guides_title" varchar NOT NULL,
  	"most_viewed_guides_description" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"accessibility_title" varchar NOT NULL,
  	"accessibility_content" jsonb NOT NULL,
  	"accessibility_html" varchar NOT NULL,
  	"legal_notice_title" varchar NOT NULL,
  	"legal_notice_content" jsonb NOT NULL,
  	"legal_notice_html" varchar NOT NULL,
  	"cgu_title" varchar NOT NULL,
  	"cgu_content" jsonb NOT NULL,
  	"cgu_html" varchar NOT NULL,
  	"terms_of_use_title" varchar NOT NULL,
  	"terms_of_use_content" jsonb NOT NULL,
  	"terms_of_use_html" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "practical_guide_vectors" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "footer" CASCADE;`)
}
