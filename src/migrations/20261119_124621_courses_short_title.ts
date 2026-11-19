import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses" ADD COLUMN "simplified_title" varchar;
  ALTER TABLE "_courses_v" ADD COLUMN "version_simplified_title" varchar;
  UPDATE "courses" SET "simplified_title" = "title";
  UPDATE "_courses_v" SET "version_simplified_title" = "version_title";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses" DROP COLUMN "simplified_title";
  ALTER TABLE "_courses_v" DROP COLUMN "version_simplified_title";`)
}
