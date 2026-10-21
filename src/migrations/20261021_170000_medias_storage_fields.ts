import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// plugin-cloud-storage 3.90 ajoute `_objectKey` à `medias` ; `prefix` vient de
// `alwaysInsertFields`. IF NOT EXISTS : une base de dev poussée peut déjà les avoir.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "medias" ADD COLUMN IF NOT EXISTS "prefix" varchar DEFAULT '';
  ALTER TABLE "medias" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "medias" DROP COLUMN IF EXISTS "prefix";
  ALTER TABLE "medias" DROP COLUMN IF EXISTS "_objectkey";`)
}
