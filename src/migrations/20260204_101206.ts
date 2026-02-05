import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_personas_pictogram" AS ENUM('Avatar', 'HumanCooperation', 'CityHall', 'SelfTraining');
  ALTER TABLE "personas" ADD COLUMN "pictogram" "enum_personas_pictogram";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "personas" DROP COLUMN "pictogram";
  DROP TYPE "public"."enum_personas_pictogram";`)
}
