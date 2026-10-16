import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home" ADD COLUMN "contact_phone_title" varchar DEFAULT 'Par téléphone';
  ALTER TABLE "home" ADD COLUMN "contact_phone_number" varchar DEFAULT '';
  ALTER TABLE "home" ADD COLUMN "contact_phone_label" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_note" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_lundi_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_lundi_open_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_lundi_close_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_mardi_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_mardi_open_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_mardi_close_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_mercredi_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_mercredi_open_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_mercredi_close_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_jeudi_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_jeudi_open_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_jeudi_close_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_vendredi_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_vendredi_open_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_vendredi_close_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_samedi_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_samedi_open_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_samedi_close_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_dimanche_closed" boolean DEFAULT false;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_dimanche_open_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_phone_schedule_dimanche_close_time" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_contact_form_title" varchar DEFAULT 'Par écrit';
  ALTER TABLE "home" ADD COLUMN "contact_contact_form_description" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_contact_form_button_label" varchar DEFAULT 'Écrire au service';
  ALTER TABLE "home" ADD COLUMN "contact_contact_form_url" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_directory_title" varchar DEFAULT 'Annuaire';
  ALTER TABLE "home" ADD COLUMN "contact_directory_description" varchar;
  ALTER TABLE "home" ADD COLUMN "contact_directory_button_label" varchar DEFAULT 'Consulter l''annuaire';
  ALTER TABLE "home" ADD COLUMN "contact_directory_url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
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
