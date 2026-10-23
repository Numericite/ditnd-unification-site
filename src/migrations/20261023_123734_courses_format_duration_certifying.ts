import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_courses_format" AS ENUM('pres', 'dist');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_courses_duration" AS ENUM('lt1j', '1-3j', 'gt3j');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_courses_certifying" AS ENUM('yes', 'no');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__courses_v_version_format" AS ENUM('pres', 'dist');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__courses_v_version_duration" AS ENUM('lt1j', '1-3j', 'gt3j');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__courses_v_version_certifying" AS ENUM('yes', 'no');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "format" "enum_courses_format";
  ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "duration" "enum_courses_duration";
  ALTER TABLE "courses" ADD COLUMN IF NOT EXISTS "certifying" "enum_courses_certifying";
  ALTER TABLE "_courses_v" ADD COLUMN IF NOT EXISTS "version_format" "enum__courses_v_version_format";
  ALTER TABLE "_courses_v" ADD COLUMN IF NOT EXISTS "version_duration" "enum__courses_v_version_duration";
  ALTER TABLE "_courses_v" ADD COLUMN IF NOT EXISTS "version_certifying" "enum__courses_v_version_certifying";

  DO $$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'courses' AND column_name = 'type'
    ) THEN
      UPDATE "courses" SET "format" = (
        CASE WHEN "type"::text = 'Présentiel' THEN 'pres' ELSE 'dist' END
      )::"enum_courses_format"
      WHERE "type" IS NOT NULL AND "format" IS NULL;
    END IF;
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = '_courses_v' AND column_name = 'version_type'
    ) THEN
      UPDATE "_courses_v" SET "version_format" = (
        CASE WHEN "version_type"::text = 'Présentiel' THEN 'pres' ELSE 'dist' END
      )::"enum__courses_v_version_format"
      WHERE "version_type" IS NOT NULL AND "version_format" IS NULL;
    END IF;
  END $$;

  ALTER TABLE "courses" DROP COLUMN IF EXISTS "type";
  ALTER TABLE "_courses_v" DROP COLUMN IF EXISTS "version_type";
  DROP TYPE IF EXISTS "public"."enum_courses_type";
  DROP TYPE IF EXISTS "public"."enum__courses_v_version_type";`)
}

// Retour arrière avec perte : Distanciel ne dit pas s'il s'agissait d'un MOOC
// ou d'un webinaire, on le reprend en MOOC. Durée et Certifiant sont perdus.
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_courses_type" AS ENUM('MOOC', 'Webinaire', 'Présentiel');
  CREATE TYPE "public"."enum__courses_v_version_type" AS ENUM('MOOC', 'Webinaire', 'Présentiel');
  ALTER TABLE "courses" ADD COLUMN "type" "enum_courses_type";
  ALTER TABLE "_courses_v" ADD COLUMN "version_type" "enum__courses_v_version_type";
  UPDATE "courses" SET "type" = (
    CASE WHEN "format"::text = 'pres' THEN 'Présentiel' ELSE 'MOOC' END
  )::"enum_courses_type"
  WHERE "format" IS NOT NULL;
  UPDATE "_courses_v" SET "version_type" = (
    CASE WHEN "version_format"::text = 'pres' THEN 'Présentiel' ELSE 'MOOC' END
  )::"enum__courses_v_version_type"
  WHERE "version_format" IS NOT NULL;
  ALTER TABLE "courses" DROP COLUMN "format";
  ALTER TABLE "courses" DROP COLUMN "duration";
  ALTER TABLE "courses" DROP COLUMN "certifying";
  ALTER TABLE "_courses_v" DROP COLUMN "version_format";
  ALTER TABLE "_courses_v" DROP COLUMN "version_duration";
  ALTER TABLE "_courses_v" DROP COLUMN "version_certifying";
  DROP TYPE "public"."enum_courses_format";
  DROP TYPE "public"."enum_courses_duration";
  DROP TYPE "public"."enum_courses_certifying";
  DROP TYPE "public"."enum__courses_v_version_format";
  DROP TYPE "public"."enum__courses_v_version_duration";
  DROP TYPE "public"."enum__courses_v_version_certifying";`)
}
