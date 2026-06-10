import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "conditions" ADD COLUMN "full_description" varchar;`)
  await db.execute(sql`
   UPDATE "conditions" SET "full_description" = '[À RÉDIGER]' WHERE "full_description" IS NULL;`)
  await db.execute(sql`
   ALTER TABLE "conditions" ALTER COLUMN "full_description" SET NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "conditions" DROP COLUMN "full_description";`)
}
