import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "_practical_guides_v" ADD COLUMN "autosave" boolean;
  CREATE INDEX "_practical_guides_v_autosave_idx" ON "_practical_guides_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "_practical_guides_v_autosave_idx";
  ALTER TABLE "_practical_guides_v" DROP COLUMN "autosave";`)
}
