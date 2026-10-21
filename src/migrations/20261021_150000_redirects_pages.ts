import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "redirects_rels" ADD COLUMN IF NOT EXISTS "pages_id" integer;
  DO $$ BEGIN
    ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "redirects_rels_pages_id_idx" ON "redirects_rels" USING btree ("pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "redirects_rels" DROP CONSTRAINT IF EXISTS "redirects_rels_pages_fk";

  DROP INDEX IF EXISTS "redirects_rels_pages_id_idx";
  ALTER TABLE "redirects_rels" DROP COLUMN IF EXISTS "pages_id";`)
}
