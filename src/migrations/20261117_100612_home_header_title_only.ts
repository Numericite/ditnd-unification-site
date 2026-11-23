import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" DROP COLUMN "header_description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // The removed text is gone: refill existing rows with an empty description
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "header_description" varchar DEFAULT '' NOT NULL;
  ALTER TABLE "home" ALTER COLUMN "header_description" DROP DEFAULT;`)
}
