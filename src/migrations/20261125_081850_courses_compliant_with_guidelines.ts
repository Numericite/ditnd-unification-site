import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "compliant_with_guidelines" boolean DEFAULT false;
  ALTER TABLE "_courses_v" ADD COLUMN IF NOT EXISTS "version_compliant_with_guidelines" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses" DROP COLUMN IF EXISTS "compliant_with_guidelines";
  ALTER TABLE "_courses_v" DROP COLUMN IF EXISTS "version_compliant_with_guidelines";`)
}
