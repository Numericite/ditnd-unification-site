import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "practical_guide_views" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"guide_id" integer NOT NULL,
  	"view_count" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "conditions" ALTER COLUMN "text_color" SET DEFAULT '#162316';
  ALTER TABLE "conditions" ALTER COLUMN "background_color" SET DEFAULT '#F4F5F0';
  ALTER TABLE "medias" ADD COLUMN "sizes_thumbnail_url" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_thumbnail_width" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_thumbnail_height" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_thumbnail_filename" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_square_url" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_square_width" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_square_height" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_square_mime_type" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_square_filesize" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_square_filename" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_small_url" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_small_width" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_small_height" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_small_mime_type" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_small_filesize" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_small_filename" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_medium_url" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_medium_width" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_medium_height" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_medium_mime_type" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_medium_filesize" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_medium_filename" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_large_url" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_large_width" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_large_height" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_large_mime_type" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_large_filesize" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_large_filename" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_banner_url" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_banner_width" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_banner_height" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_banner_mime_type" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_banner_filesize" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_banner_filename" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "practical_guide_views_id" integer;
  ALTER TABLE "practical_guide_views" ADD CONSTRAINT "practical_guide_views_guide_id_practical_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."practical_guides"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "practical_guide_views_guide_idx" ON "practical_guide_views" USING btree ("guide_id");
  CREATE INDEX "practical_guide_views_updated_at_idx" ON "practical_guide_views" USING btree ("updated_at");
  CREATE INDEX "practical_guide_views_created_at_idx" ON "practical_guide_views" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_practical_guide_views_fk" FOREIGN KEY ("practical_guide_views_id") REFERENCES "public"."practical_guide_views"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "medias_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "medias" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "medias_sizes_square_sizes_square_filename_idx" ON "medias" USING btree ("sizes_square_filename");
  CREATE INDEX "medias_sizes_small_sizes_small_filename_idx" ON "medias" USING btree ("sizes_small_filename");
  CREATE INDEX "medias_sizes_medium_sizes_medium_filename_idx" ON "medias" USING btree ("sizes_medium_filename");
  CREATE INDEX "medias_sizes_large_sizes_large_filename_idx" ON "medias" USING btree ("sizes_large_filename");
  CREATE INDEX "medias_sizes_banner_sizes_banner_filename_idx" ON "medias" USING btree ("sizes_banner_filename");
  CREATE INDEX "payload_locked_documents_rels_practical_guide_views_id_idx" ON "payload_locked_documents_rels" USING btree ("practical_guide_views_id");
  ALTER TABLE "practical_guides" DROP COLUMN "view_count";
  ALTER TABLE "_practical_guides_v" DROP COLUMN "version_view_count";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "practical_guide_views" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "practical_guide_views" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_practical_guide_views_fk";
  
  DROP INDEX "medias_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX "medias_sizes_square_sizes_square_filename_idx";
  DROP INDEX "medias_sizes_small_sizes_small_filename_idx";
  DROP INDEX "medias_sizes_medium_sizes_medium_filename_idx";
  DROP INDEX "medias_sizes_large_sizes_large_filename_idx";
  DROP INDEX "medias_sizes_banner_sizes_banner_filename_idx";
  DROP INDEX "payload_locked_documents_rels_practical_guide_views_id_idx";
  ALTER TABLE "conditions" ALTER COLUMN "text_color" DROP DEFAULT;
  ALTER TABLE "conditions" ALTER COLUMN "background_color" DROP DEFAULT;
  ALTER TABLE "practical_guides" ADD COLUMN "view_count" numeric DEFAULT 0;
  ALTER TABLE "_practical_guides_v" ADD COLUMN "version_view_count" numeric DEFAULT 0;
  ALTER TABLE "medias" DROP COLUMN "sizes_thumbnail_url";
  ALTER TABLE "medias" DROP COLUMN "sizes_thumbnail_width";
  ALTER TABLE "medias" DROP COLUMN "sizes_thumbnail_height";
  ALTER TABLE "medias" DROP COLUMN "sizes_thumbnail_mime_type";
  ALTER TABLE "medias" DROP COLUMN "sizes_thumbnail_filesize";
  ALTER TABLE "medias" DROP COLUMN "sizes_thumbnail_filename";
  ALTER TABLE "medias" DROP COLUMN "sizes_square_url";
  ALTER TABLE "medias" DROP COLUMN "sizes_square_width";
  ALTER TABLE "medias" DROP COLUMN "sizes_square_height";
  ALTER TABLE "medias" DROP COLUMN "sizes_square_mime_type";
  ALTER TABLE "medias" DROP COLUMN "sizes_square_filesize";
  ALTER TABLE "medias" DROP COLUMN "sizes_square_filename";
  ALTER TABLE "medias" DROP COLUMN "sizes_small_url";
  ALTER TABLE "medias" DROP COLUMN "sizes_small_width";
  ALTER TABLE "medias" DROP COLUMN "sizes_small_height";
  ALTER TABLE "medias" DROP COLUMN "sizes_small_mime_type";
  ALTER TABLE "medias" DROP COLUMN "sizes_small_filesize";
  ALTER TABLE "medias" DROP COLUMN "sizes_small_filename";
  ALTER TABLE "medias" DROP COLUMN "sizes_medium_url";
  ALTER TABLE "medias" DROP COLUMN "sizes_medium_width";
  ALTER TABLE "medias" DROP COLUMN "sizes_medium_height";
  ALTER TABLE "medias" DROP COLUMN "sizes_medium_mime_type";
  ALTER TABLE "medias" DROP COLUMN "sizes_medium_filesize";
  ALTER TABLE "medias" DROP COLUMN "sizes_medium_filename";
  ALTER TABLE "medias" DROP COLUMN "sizes_large_url";
  ALTER TABLE "medias" DROP COLUMN "sizes_large_width";
  ALTER TABLE "medias" DROP COLUMN "sizes_large_height";
  ALTER TABLE "medias" DROP COLUMN "sizes_large_mime_type";
  ALTER TABLE "medias" DROP COLUMN "sizes_large_filesize";
  ALTER TABLE "medias" DROP COLUMN "sizes_large_filename";
  ALTER TABLE "medias" DROP COLUMN "sizes_banner_url";
  ALTER TABLE "medias" DROP COLUMN "sizes_banner_width";
  ALTER TABLE "medias" DROP COLUMN "sizes_banner_height";
  ALTER TABLE "medias" DROP COLUMN "sizes_banner_mime_type";
  ALTER TABLE "medias" DROP COLUMN "sizes_banner_filesize";
  ALTER TABLE "medias" DROP COLUMN "sizes_banner_filename";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "practical_guide_views_id";`)
}
