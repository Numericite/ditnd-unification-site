import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "ditnd_id" numeric;
  ALTER TABLE "_courses_v" ADD COLUMN IF NOT EXISTS "version_ditnd_id" numeric;
  CREATE INDEX IF NOT EXISTS "courses_ditnd_id_idx" ON "courses" USING btree ("ditnd_id");
  CREATE INDEX IF NOT EXISTS "_courses_v_version_version_ditnd_id_idx" ON "_courses_v" USING btree ("version_ditnd_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "courses_ditnd_id_idx";
  DROP INDEX IF EXISTS "_courses_v_version_version_ditnd_id_idx";
  ALTER TABLE "courses" DROP COLUMN IF EXISTS "ditnd_id";
  ALTER TABLE "_courses_v" DROP COLUMN IF EXISTS "version_ditnd_id";`)
}
