import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "practical_guides_slug_idx";
  DROP INDEX "_practical_guides_v_version_version_slug_idx";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE UNIQUE INDEX "practical_guides_slug_idx" ON "practical_guides" USING btree ("slug");
  CREATE INDEX "_practical_guides_v_version_version_slug_idx" ON "_practical_guides_v" USING btree ("version_slug");`)
}
