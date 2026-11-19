import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const title = 'Site national d’informations\nsur l’autisme et ses troubles associés'
const description =
  'Informations et ressources validées par des experts, à destination des personnes concernées, leurs proches et les professionnels.'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" ADD COLUMN "header_description" varchar;`)
  // The new hero text ships with the release, so staging and production get it without a re-seed
  await db.execute(sql`
   UPDATE "home" SET "header_title" = ${title}, "header_description" = ${description};`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home" DROP COLUMN "header_description";`)
}
