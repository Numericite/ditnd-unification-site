import {
	type MigrateUpArgs,
	type MigrateDownArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about" ADD COLUMN "maison_de_l_autisme_meta_title" varchar;
  ALTER TABLE "about" ADD COLUMN "maison_de_l_autisme_meta_description" varchar;
  ALTER TABLE "about" ADD COLUMN "maison_de_l_autisme_meta_image_id" integer;
  ALTER TABLE "about" ADD COLUMN "gncra_meta_title" varchar;
  ALTER TABLE "about" ADD COLUMN "gncra_meta_description" varchar;
  ALTER TABLE "about" ADD COLUMN "gncra_meta_image_id" integer;
  ALTER TABLE "about" ADD COLUMN "cras_meta_title" varchar;
  ALTER TABLE "about" ADD COLUMN "cras_meta_description" varchar;
  ALTER TABLE "about" ADD COLUMN "cras_meta_image_id" integer;
  ALTER TABLE "about" ADD CONSTRAINT "about_maison_de_l_autisme_meta_image_id_medias_id_fk" FOREIGN KEY ("maison_de_l_autisme_meta_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_gncra_meta_image_id_medias_id_fk" FOREIGN KEY ("gncra_meta_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_cras_meta_image_id_medias_id_fk" FOREIGN KEY ("cras_meta_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_maison_de_l_autisme_meta_maison_de_l_autisme_meta__idx" ON "about" USING btree ("maison_de_l_autisme_meta_image_id");
  CREATE INDEX "about_gncra_meta_gncra_meta_image_idx" ON "about" USING btree ("gncra_meta_image_id");
  CREATE INDEX "about_cras_meta_cras_meta_image_idx" ON "about" USING btree ("cras_meta_image_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "about" DROP CONSTRAINT "about_maison_de_l_autisme_meta_image_id_medias_id_fk";
  ALTER TABLE "about" DROP CONSTRAINT "about_gncra_meta_image_id_medias_id_fk";
  ALTER TABLE "about" DROP CONSTRAINT "about_cras_meta_image_id_medias_id_fk";
  DROP INDEX "about_maison_de_l_autisme_meta_maison_de_l_autisme_meta__idx";
  DROP INDEX "about_gncra_meta_gncra_meta_image_idx";
  DROP INDEX "about_cras_meta_cras_meta_image_idx";
  ALTER TABLE "about" DROP COLUMN "maison_de_l_autisme_meta_title";
  ALTER TABLE "about" DROP COLUMN "maison_de_l_autisme_meta_description";
  ALTER TABLE "about" DROP COLUMN "maison_de_l_autisme_meta_image_id";
  ALTER TABLE "about" DROP COLUMN "gncra_meta_title";
  ALTER TABLE "about" DROP COLUMN "gncra_meta_description";
  ALTER TABLE "about" DROP COLUMN "gncra_meta_image_id";
  ALTER TABLE "about" DROP COLUMN "cras_meta_title";
  ALTER TABLE "about" DROP COLUMN "cras_meta_description";
  ALTER TABLE "about" DROP COLUMN "cras_meta_image_id";`)
}
