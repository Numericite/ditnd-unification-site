import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_news_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__news_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "news" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"category" varchar,
  	"link_url" varchar,
  	"link_label" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_news_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "news_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"personas_id" integer
  );
  
  CREATE TABLE "_news_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_category" varchar,
  	"version_link_url" varchar,
  	"version_link_label" varchar,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__news_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_news_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"personas_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "news_id" integer;
  ALTER TABLE "news" ADD CONSTRAINT "news_image_id_medias_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "news_rels" ADD CONSTRAINT "news_rels_personas_fk" FOREIGN KEY ("personas_id") REFERENCES "public"."personas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_parent_id_news_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."news"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_image_id_medias_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_news_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_news_v_rels" ADD CONSTRAINT "_news_v_rels_personas_fk" FOREIGN KEY ("personas_id") REFERENCES "public"."personas"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "news__order_idx" ON "news" USING btree ("_order");
  CREATE UNIQUE INDEX "news_slug_idx" ON "news" USING btree ("slug");
  CREATE INDEX "news_image_idx" ON "news" USING btree ("image_id");
  CREATE INDEX "news_updated_at_idx" ON "news" USING btree ("updated_at");
  CREATE INDEX "news_created_at_idx" ON "news" USING btree ("created_at");
  CREATE INDEX "news__status_idx" ON "news" USING btree ("_status");
  CREATE INDEX "news_rels_order_idx" ON "news_rels" USING btree ("order");
  CREATE INDEX "news_rels_parent_idx" ON "news_rels" USING btree ("parent_id");
  CREATE INDEX "news_rels_path_idx" ON "news_rels" USING btree ("path");
  CREATE INDEX "news_rels_personas_id_idx" ON "news_rels" USING btree ("personas_id");
  CREATE INDEX "_news_v_parent_idx" ON "_news_v" USING btree ("parent_id");
  CREATE INDEX "_news_v_version_version__order_idx" ON "_news_v" USING btree ("version__order");
  CREATE INDEX "_news_v_version_version_slug_idx" ON "_news_v" USING btree ("version_slug");
  CREATE INDEX "_news_v_version_version_image_idx" ON "_news_v" USING btree ("version_image_id");
  CREATE INDEX "_news_v_version_version_updated_at_idx" ON "_news_v" USING btree ("version_updated_at");
  CREATE INDEX "_news_v_version_version_created_at_idx" ON "_news_v" USING btree ("version_created_at");
  CREATE INDEX "_news_v_version_version__status_idx" ON "_news_v" USING btree ("version__status");
  CREATE INDEX "_news_v_created_at_idx" ON "_news_v" USING btree ("created_at");
  CREATE INDEX "_news_v_updated_at_idx" ON "_news_v" USING btree ("updated_at");
  CREATE INDEX "_news_v_latest_idx" ON "_news_v" USING btree ("latest");
  CREATE INDEX "_news_v_rels_order_idx" ON "_news_v_rels" USING btree ("order");
  CREATE INDEX "_news_v_rels_parent_idx" ON "_news_v_rels" USING btree ("parent_id");
  CREATE INDEX "_news_v_rels_path_idx" ON "_news_v_rels" USING btree ("path");
  CREATE INDEX "_news_v_rels_personas_id_idx" ON "_news_v_rels" USING btree ("personas_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_news_fk" FOREIGN KEY ("news_id") REFERENCES "public"."news"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_news_id_idx" ON "payload_locked_documents_rels" USING btree ("news_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "news_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_news_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "news" CASCADE;
  DROP TABLE "news_rels" CASCADE;
  DROP TABLE "_news_v" CASCADE;
  DROP TABLE "_news_v_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_news_fk";
  
  DROP INDEX "payload_locked_documents_rels_news_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "news_id";
  DROP TYPE "public"."enum_news_status";
  DROP TYPE "public"."enum__news_v_version_status";`)
}
