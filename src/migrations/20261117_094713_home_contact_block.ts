import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"phone_title" varchar DEFAULT 'Par téléphone',
  	"phone_number" varchar DEFAULT '0 800 71 40 40' NOT NULL,
  	"phone_label" varchar,
  	"phone_schedule_note" varchar,
  	"phone_schedule_lundi_closed" boolean DEFAULT false,
  	"phone_schedule_lundi_open_time" timestamp(3) with time zone,
  	"phone_schedule_lundi_close_time" timestamp(3) with time zone,
  	"phone_schedule_mardi_closed" boolean DEFAULT false,
  	"phone_schedule_mardi_open_time" timestamp(3) with time zone,
  	"phone_schedule_mardi_close_time" timestamp(3) with time zone,
  	"phone_schedule_mercredi_closed" boolean DEFAULT false,
  	"phone_schedule_mercredi_open_time" timestamp(3) with time zone,
  	"phone_schedule_mercredi_close_time" timestamp(3) with time zone,
  	"phone_schedule_jeudi_closed" boolean DEFAULT false,
  	"phone_schedule_jeudi_open_time" timestamp(3) with time zone,
  	"phone_schedule_jeudi_close_time" timestamp(3) with time zone,
  	"phone_schedule_vendredi_closed" boolean DEFAULT false,
  	"phone_schedule_vendredi_open_time" timestamp(3) with time zone,
  	"phone_schedule_vendredi_close_time" timestamp(3) with time zone,
  	"phone_schedule_samedi_closed" boolean DEFAULT false,
  	"phone_schedule_samedi_open_time" timestamp(3) with time zone,
  	"phone_schedule_samedi_close_time" timestamp(3) with time zone,
  	"phone_schedule_dimanche_closed" boolean DEFAULT false,
  	"phone_schedule_dimanche_open_time" timestamp(3) with time zone,
  	"phone_schedule_dimanche_close_time" timestamp(3) with time zone,
  	"contact_form_title" varchar DEFAULT 'Par écrit',
  	"contact_form_description" varchar,
  	"contact_form_button_label" varchar DEFAULT 'Écrire au service',
  	"contact_form_url" varchar,
  	"directory_title" varchar DEFAULT 'Annuaire',
  	"directory_description" varchar,
  	"directory_button_label" varchar DEFAULT 'Consulter l''annuaire',
  	"directory_url" varchar DEFAULT 'https://annuaire.autismeinfoservice.fr/',
  	"block_name" varchar
  );
  
  ALTER TABLE "home_blocks_contact" ADD CONSTRAINT "home_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_blocks_contact_order_idx" ON "home_blocks_contact" USING btree ("_order");
  CREATE INDEX "home_blocks_contact_parent_id_idx" ON "home_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_contact_path_idx" ON "home_blocks_contact" USING btree ("_path");

  UPDATE "home_blocks_news_carousel" SET "_order" = "_order" + 1;
  UPDATE "home_blocks_persona_tiles" SET "_order" = "_order" + 1;
  UPDATE "home_blocks_most_viewed_guides" SET "_order" = "_order" + 1;
  UPDATE "home_blocks_newsletter" SET "_order" = "_order" + 1;

  INSERT INTO "home_blocks_contact" ("_order", "_parent_id", "_path", "id", "visible", "phone_title", "phone_number", "phone_label", "phone_schedule_note", "phone_schedule_lundi_closed", "phone_schedule_lundi_open_time", "phone_schedule_lundi_close_time", "phone_schedule_mardi_closed", "phone_schedule_mardi_open_time", "phone_schedule_mardi_close_time", "phone_schedule_mercredi_closed", "phone_schedule_mercredi_open_time", "phone_schedule_mercredi_close_time", "phone_schedule_jeudi_closed", "phone_schedule_jeudi_open_time", "phone_schedule_jeudi_close_time", "phone_schedule_vendredi_closed", "phone_schedule_vendredi_open_time", "phone_schedule_vendredi_close_time", "phone_schedule_samedi_closed", "phone_schedule_samedi_open_time", "phone_schedule_samedi_close_time", "phone_schedule_dimanche_closed", "phone_schedule_dimanche_open_time", "phone_schedule_dimanche_close_time", "contact_form_title", "contact_form_description", "contact_form_button_label", "contact_form_url", "directory_title", "directory_description", "directory_button_label", "directory_url")
  SELECT 1, h."id", 'sections', substr(md5(random()::text), 1, 24), true, h."contact_phone_title", h."contact_phone_number", h."contact_phone_label", h."contact_phone_schedule_note", h."contact_phone_schedule_lundi_closed", h."contact_phone_schedule_lundi_open_time", h."contact_phone_schedule_lundi_close_time", h."contact_phone_schedule_mardi_closed", h."contact_phone_schedule_mardi_open_time", h."contact_phone_schedule_mardi_close_time", h."contact_phone_schedule_mercredi_closed", h."contact_phone_schedule_mercredi_open_time", h."contact_phone_schedule_mercredi_close_time", h."contact_phone_schedule_jeudi_closed", h."contact_phone_schedule_jeudi_open_time", h."contact_phone_schedule_jeudi_close_time", h."contact_phone_schedule_vendredi_closed", h."contact_phone_schedule_vendredi_open_time", h."contact_phone_schedule_vendredi_close_time", h."contact_phone_schedule_samedi_closed", h."contact_phone_schedule_samedi_open_time", h."contact_phone_schedule_samedi_close_time", h."contact_phone_schedule_dimanche_closed", h."contact_phone_schedule_dimanche_open_time", h."contact_phone_schedule_dimanche_close_time", h."contact_contact_form_title", h."contact_contact_form_description", h."contact_contact_form_button_label", h."contact_contact_form_url", h."contact_directory_title", h."contact_directory_description", h."contact_directory_button_label", h."contact_directory_url"
  FROM "home" h;

  ALTER TABLE "home" DROP COLUMN "contact_phone_title";
  ALTER TABLE "home" DROP COLUMN "contact_phone_number";
  ALTER TABLE "home" DROP COLUMN "contact_phone_label";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_note";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_lundi_closed";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_lundi_open_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_lundi_close_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_mardi_closed";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_mardi_open_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_mardi_close_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_mercredi_closed";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_mercredi_open_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_mercredi_close_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_jeudi_closed";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_jeudi_open_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_jeudi_close_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_vendredi_closed";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_vendredi_open_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_vendredi_close_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_samedi_closed";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_samedi_open_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_samedi_close_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_dimanche_closed";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_dimanche_open_time";
  ALTER TABLE "home" DROP COLUMN "contact_phone_schedule_dimanche_close_time";
  ALTER TABLE "home" DROP COLUMN "contact_contact_form_title";
  ALTER TABLE "home" DROP COLUMN "contact_contact_form_description";
  ALTER TABLE "home" DROP COLUMN "contact_contact_form_button_label";
  ALTER TABLE "home" DROP COLUMN "contact_contact_form_url";
  ALTER TABLE "home" DROP COLUMN "contact_directory_title";
  ALTER TABLE "home" DROP COLUMN "contact_directory_description";
  ALTER TABLE "home" DROP COLUMN "contact_directory_button_label";
  ALTER TABLE "home" DROP COLUMN "contact_directory_url";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "contact_phone_title" varchar DEFAULT 'Par téléphone';
  ALTER TABLE "home" ADD COLUMN "contact_phone_number" varchar DEFAULT '0 800 71 40 40' NOT NULL;
  ALTER TABLE "home" ADD COLUMN "contact_phone_label" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_note" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_lundi_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_lundi_open_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_lundi_close_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_mardi_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_mardi_open_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_mardi_close_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_mercredi_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_mercredi_open_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_mercredi_close_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_jeudi_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_jeudi_open_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_jeudi_close_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_vendredi_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_vendredi_open_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_vendredi_close_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_samedi_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_samedi_open_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_samedi_close_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_dimanche_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_dimanche_open_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_dimanche_close_time" timestamp(3) with time zone;
  ALTER TABLE "home" ADD COLUMN "contact_contact_form_title" varchar DEFAULT 'Par écrit';
  ALTER TABLE "home" ADD COLUMN "contact_contact_form_description" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_contact_form_button_label" varchar DEFAULT 'Écrire au service';
  ALTER TABLE "home" ADD COLUMN "contact_contact_form_url" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_directory_title" varchar DEFAULT 'Annuaire';
  ALTER TABLE "home" ADD COLUMN "contact_directory_description" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_directory_button_label" varchar DEFAULT 'Consulter l''annuaire';
  ALTER TABLE "home" ADD COLUMN "contact_directory_url" varchar DEFAULT 'https://annuaire.autismeinfoservice.fr/';

  UPDATE "home" h SET
    "contact_phone_title" = c."phone_title",
    "contact_phone_number" = c."phone_number",
    "contact_phone_label" = c."phone_label",
    "contact_phone_schedule_note" = c."phone_schedule_note",
    "contact_phone_schedule_lundi_closed" = c."phone_schedule_lundi_closed",
    "contact_phone_schedule_lundi_open_time" = c."phone_schedule_lundi_open_time",
    "contact_phone_schedule_lundi_close_time" = c."phone_schedule_lundi_close_time",
    "contact_phone_schedule_mardi_closed" = c."phone_schedule_mardi_closed",
    "contact_phone_schedule_mardi_open_time" = c."phone_schedule_mardi_open_time",
    "contact_phone_schedule_mardi_close_time" = c."phone_schedule_mardi_close_time",
    "contact_phone_schedule_mercredi_closed" = c."phone_schedule_mercredi_closed",
    "contact_phone_schedule_mercredi_open_time" = c."phone_schedule_mercredi_open_time",
    "contact_phone_schedule_mercredi_close_time" = c."phone_schedule_mercredi_close_time",
    "contact_phone_schedule_jeudi_closed" = c."phone_schedule_jeudi_closed",
    "contact_phone_schedule_jeudi_open_time" = c."phone_schedule_jeudi_open_time",
    "contact_phone_schedule_jeudi_close_time" = c."phone_schedule_jeudi_close_time",
    "contact_phone_schedule_vendredi_closed" = c."phone_schedule_vendredi_closed",
    "contact_phone_schedule_vendredi_open_time" = c."phone_schedule_vendredi_open_time",
    "contact_phone_schedule_vendredi_close_time" = c."phone_schedule_vendredi_close_time",
    "contact_phone_schedule_samedi_closed" = c."phone_schedule_samedi_closed",
    "contact_phone_schedule_samedi_open_time" = c."phone_schedule_samedi_open_time",
    "contact_phone_schedule_samedi_close_time" = c."phone_schedule_samedi_close_time",
    "contact_phone_schedule_dimanche_closed" = c."phone_schedule_dimanche_closed",
    "contact_phone_schedule_dimanche_open_time" = c."phone_schedule_dimanche_open_time",
    "contact_phone_schedule_dimanche_close_time" = c."phone_schedule_dimanche_close_time",
    "contact_contact_form_title" = c."contact_form_title",
    "contact_contact_form_description" = c."contact_form_description",
    "contact_contact_form_button_label" = c."contact_form_button_label",
    "contact_contact_form_url" = c."contact_form_url",
    "contact_directory_title" = c."directory_title",
    "contact_directory_description" = c."directory_description",
    "contact_directory_button_label" = c."directory_button_label",
    "contact_directory_url" = c."directory_url"
  FROM "home_blocks_contact" c WHERE c."_parent_id" = h."id";

  UPDATE "home_blocks_news_carousel" b SET "_order" = b."_order" - 1 FROM "home_blocks_contact" c WHERE c."_parent_id" = b."_parent_id" AND b."_order" > c."_order";
  UPDATE "home_blocks_persona_tiles" b SET "_order" = b."_order" - 1 FROM "home_blocks_contact" c WHERE c."_parent_id" = b."_parent_id" AND b."_order" > c."_order";
  UPDATE "home_blocks_most_viewed_guides" b SET "_order" = b."_order" - 1 FROM "home_blocks_contact" c WHERE c."_parent_id" = b."_parent_id" AND b."_order" > c."_order";
  UPDATE "home_blocks_newsletter" b SET "_order" = b."_order" - 1 FROM "home_blocks_contact" c WHERE c."_parent_id" = b."_parent_id" AND b."_order" > c."_order";

  DROP TABLE "home_blocks_contact" CASCADE;`)
}
