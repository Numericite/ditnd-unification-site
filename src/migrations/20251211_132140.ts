import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  ALTER TABLE "practical_guide" ALTER COLUMN "content" SET DATA TYPE jsonb;
  ALTER TABLE "users" ADD COLUMN "last_name" varchar;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'editor' NOT NULL;
  ALTER TABLE "practical_guide" ADD COLUMN "html" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "practical_guide" ALTER COLUMN "content" SET DATA TYPE varchar;
  ALTER TABLE "users" DROP COLUMN "last_name";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "practical_guide" DROP COLUMN "html";
  DROP TYPE "public"."enum_users_role";`)
}
