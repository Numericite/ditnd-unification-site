import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_maps_basemap" AS ENUM('plan-ign', 'aerial');
  ALTER TABLE "maps" ADD COLUMN "basemap" "enum_maps_basemap" DEFAULT 'plan-ign' NOT NULL;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "maps" DROP COLUMN "basemap";
  DROP TYPE "public"."enum_maps_basemap";`)
}
