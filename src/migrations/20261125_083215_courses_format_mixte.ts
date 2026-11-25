import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_courses_format" ADD VALUE IF NOT EXISTS 'mixte';
  ALTER TYPE "public"."enum__courses_v_version_format" ADD VALUE IF NOT EXISTS 'mixte';`)
}

// Retour arrière avec perte : les formations Mixte repassent en Distanciel.
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses" ALTER COLUMN "format" SET DATA TYPE text;
  UPDATE "courses" SET "format" = 'dist' WHERE "format" = 'mixte';
  DROP TYPE "public"."enum_courses_format";
  CREATE TYPE "public"."enum_courses_format" AS ENUM('pres', 'dist');
  ALTER TABLE "courses" ALTER COLUMN "format" SET DATA TYPE "public"."enum_courses_format" USING "format"::"public"."enum_courses_format";
  ALTER TABLE "_courses_v" ALTER COLUMN "version_format" SET DATA TYPE text;
  UPDATE "_courses_v" SET "version_format" = 'dist' WHERE "version_format" = 'mixte';
  DROP TYPE "public"."enum__courses_v_version_format";
  CREATE TYPE "public"."enum__courses_v_version_format" AS ENUM('pres', 'dist');
  ALTER TABLE "_courses_v" ALTER COLUMN "version_format" SET DATA TYPE "public"."enum__courses_v_version_format" USING "version_format"::"public"."enum__courses_v_version_format";`)
}
