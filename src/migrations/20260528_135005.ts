import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "map_categories_custom_fields" ALTER COLUMN "type" SET DATA TYPE text;
  ALTER TABLE "map_categories_custom_fields" ALTER COLUMN "type" SET DEFAULT 'text'::text;
  DROP TYPE "public"."enum_map_categories_custom_fields_type";
  CREATE TYPE "public"."enum_map_categories_custom_fields_type" AS ENUM('checkbox', 'text', 'select');
  ALTER TABLE "map_categories_custom_fields" ALTER COLUMN "type" SET DEFAULT 'text'::"public"."enum_map_categories_custom_fields_type";
  ALTER TABLE "map_categories_custom_fields" ALTER COLUMN "type" SET DATA TYPE "public"."enum_map_categories_custom_fields_type" USING "type"::"public"."enum_map_categories_custom_fields_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_map_categories_custom_fields_type" ADD VALUE 'number' BEFORE 'select';`)
}
