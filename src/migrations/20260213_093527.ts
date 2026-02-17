import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "practical_guides" DROP COLUMN "html";
  ALTER TABLE "_practical_guides_v" DROP COLUMN "version_html";
  ALTER TABLE "footer" DROP COLUMN "accessibility_html";
  ALTER TABLE "footer" DROP COLUMN "legal_notice_html";
  ALTER TABLE "footer" DROP COLUMN "cgu_html";
  ALTER TABLE "footer" DROP COLUMN "terms_of_use_html";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "practical_guides" ADD COLUMN "html" varchar;
  ALTER TABLE "_practical_guides_v" ADD COLUMN "version_html" varchar;
  ALTER TABLE "footer" ADD COLUMN "accessibility_html" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "legal_notice_html" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "cgu_html" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "terms_of_use_html" varchar NOT NULL;`)
}
