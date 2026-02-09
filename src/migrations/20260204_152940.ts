import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_personas_pictogram" ADD VALUE 'Hospital';
  ALTER TYPE "public"."enum_personas_pictogram" ADD VALUE 'School';
  ALTER TYPE "public"."enum_personas_pictogram" ADD VALUE 'Companie';
  ALTER TYPE "public"."enum_personas_pictogram" ADD VALUE 'Ecosystem';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "personas" ALTER COLUMN "pictogram" SET DATA TYPE text;
  DROP TYPE "public"."enum_personas_pictogram";
  CREATE TYPE "public"."enum_personas_pictogram" AS ENUM('Avatar', 'HumanCooperation', 'CityHall', 'SelfTraining');
  ALTER TABLE "personas" ALTER COLUMN "pictogram" SET DATA TYPE "public"."enum_personas_pictogram" USING "pictogram"::"public"."enum_personas_pictogram";`)
}
