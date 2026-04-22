import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"maison_de_l_autisme_title" varchar NOT NULL,
  	"maison_de_l_autisme_image_banner_id" integer,
  	"maison_de_l_autisme_content" jsonb NOT NULL,
  	"gncra_title" varchar NOT NULL,
  	"gncra_image_banner_id" integer,
  	"gncra_content" jsonb NOT NULL,
  	"cras_title" varchar NOT NULL,
  	"cras_image_banner_id" integer,
  	"cras_content" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "about" ADD CONSTRAINT "about_maison_de_l_autisme_image_banner_id_medias_id_fk" FOREIGN KEY ("maison_de_l_autisme_image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_gncra_image_banner_id_medias_id_fk" FOREIGN KEY ("gncra_image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_cras_image_banner_id_medias_id_fk" FOREIGN KEY ("cras_image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_maison_de_l_autisme_maison_de_l_autisme_image_bann_idx" ON "about" USING btree ("maison_de_l_autisme_image_banner_id");
  CREATE INDEX "about_gncra_gncra_image_banner_idx" ON "about" USING btree ("gncra_image_banner_id");
  CREATE INDEX "about_cras_cras_image_banner_idx" ON "about" USING btree ("cras_image_banner_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about" CASCADE;`)
}
