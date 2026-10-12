import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "practical_guides" ADD COLUMN "last_updated_at" timestamp(3) with time zone;
  ALTER TABLE "_practical_guides_v" ADD COLUMN "version_last_updated_at" timestamp(3) with time zone;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "practical_guides" DROP COLUMN "last_updated_at";
  ALTER TABLE "_practical_guides_v" DROP COLUMN "version_last_updated_at";`)
}
