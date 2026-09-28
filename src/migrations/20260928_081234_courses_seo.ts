import {
	type MigrateUpArgs,
	type MigrateDownArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "courses" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "courses" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_meta_image_id_medias_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "courses_meta_meta_image_idx" ON "courses" USING btree ("meta_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses" DROP CONSTRAINT "courses_meta_image_id_medias_id_fk";
  DROP INDEX "courses_meta_meta_image_idx";
  ALTER TABLE "courses" DROP COLUMN "meta_title";
  ALTER TABLE "courses" DROP COLUMN "meta_description";
  ALTER TABLE "courses" DROP COLUMN "meta_image_id";`)
}
