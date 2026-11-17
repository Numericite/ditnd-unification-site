import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "menu" ADD COLUMN "locked_items_personas_title" varchar DEFAULT 'Je suis' NOT NULL;
  ALTER TABLE "menu" ADD COLUMN "locked_items_personas_visible" boolean DEFAULT true;
  ALTER TABLE "menu" ADD COLUMN "locked_items_practical_guides_title" varchar DEFAULT 'Fiches pratiques' NOT NULL;
  ALTER TABLE "menu" ADD COLUMN "locked_items_practical_guides_visible" boolean DEFAULT true;
  ALTER TABLE "menu" ADD COLUMN "locked_items_courses_title" varchar DEFAULT 'Formations' NOT NULL;
  ALTER TABLE "menu" ADD COLUMN "locked_items_courses_visible" boolean DEFAULT true;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "menu" DROP COLUMN "locked_items_personas_title";
  ALTER TABLE "menu" DROP COLUMN "locked_items_personas_visible";
  ALTER TABLE "menu" DROP COLUMN "locked_items_practical_guides_title";
  ALTER TABLE "menu" DROP COLUMN "locked_items_practical_guides_visible";
  ALTER TABLE "menu" DROP COLUMN "locked_items_courses_title";
  ALTER TABLE "menu" DROP COLUMN "locked_items_courses_visible";`)
}
