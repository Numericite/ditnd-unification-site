import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "medias" ADD COLUMN "sizes_icon_url" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_icon_width" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_icon_height" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_icon_mime_type" varchar;
  ALTER TABLE "medias" ADD COLUMN "sizes_icon_filesize" numeric;
  ALTER TABLE "medias" ADD COLUMN "sizes_icon_filename" varchar;
  CREATE INDEX "medias_sizes_icon_sizes_icon_filename_idx" ON "medias" USING btree ("sizes_icon_filename");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "medias_sizes_icon_sizes_icon_filename_idx";
  ALTER TABLE "medias" DROP COLUMN "sizes_icon_url";
  ALTER TABLE "medias" DROP COLUMN "sizes_icon_width";
  ALTER TABLE "medias" DROP COLUMN "sizes_icon_height";
  ALTER TABLE "medias" DROP COLUMN "sizes_icon_mime_type";
  ALTER TABLE "medias" DROP COLUMN "sizes_icon_filesize";
  ALTER TABLE "medias" DROP COLUMN "sizes_icon_filename";`)
}
