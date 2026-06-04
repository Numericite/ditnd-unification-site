import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "journeys" ADD COLUMN "practical_guide_description" varchar;
  ALTER TABLE "journeys" ADD COLUMN "course_description" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "journeys" DROP COLUMN "practical_guide_description";
  ALTER TABLE "journeys" DROP COLUMN "course_description";`)
}
