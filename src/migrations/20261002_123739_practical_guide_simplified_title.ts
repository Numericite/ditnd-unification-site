import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "practical_guides" ADD COLUMN "simplified_title" varchar;
  ALTER TABLE "_practical_guides_v" ADD COLUMN "version_simplified_title" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "practical_guides" DROP COLUMN "simplified_title";
  ALTER TABLE "_practical_guides_v" DROP COLUMN "version_simplified_title";`)
}
