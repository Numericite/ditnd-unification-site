import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "practical_guides" ADD COLUMN "hide_simplified_version" boolean DEFAULT false;
  ALTER TABLE "_practical_guides_v" ADD COLUMN "version_hide_simplified_version" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "practical_guides" DROP COLUMN "hide_simplified_version";
  ALTER TABLE "_practical_guides_v" DROP COLUMN "version_hide_simplified_version";`)
}
