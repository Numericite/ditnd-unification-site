import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" RENAME COLUMN "tiles_description" TO "tiles_persona_description";
  ALTER TABLE "home" ADD COLUMN "tiles_persona_title" varchar;
  ALTER TABLE "home" ADD COLUMN "tiles_condition_title" varchar;
  ALTER TABLE "home" ADD COLUMN "tiles_condition_description" varchar;
  UPDATE "home" SET
    "tiles_persona_title" = 'Qui êtes vous?',
    "tiles_condition_title" = 'Sur quel trouble voulez-vous vous informer ?',
    "tiles_condition_description" = "tiles_persona_description";
  ALTER TABLE "home" ALTER COLUMN "tiles_persona_title" SET NOT NULL;
  ALTER TABLE "home" ALTER COLUMN "tiles_condition_title" SET NOT NULL;
  ALTER TABLE "home" ALTER COLUMN "tiles_condition_description" SET NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" RENAME COLUMN "tiles_persona_description" TO "tiles_description";
  ALTER TABLE "home" DROP COLUMN "tiles_persona_title";
  ALTER TABLE "home" DROP COLUMN "tiles_condition_title";
  ALTER TABLE "home" DROP COLUMN "tiles_condition_description";`)
}
