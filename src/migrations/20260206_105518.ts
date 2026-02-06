import {type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "personas" ADD COLUMN "_order" varchar;
  ALTER TABLE "conditions" ADD COLUMN "_order" varchar;
  CREATE INDEX "personas__order_idx" ON "personas" USING btree ("_order");
  CREATE INDEX "conditions__order_idx" ON "conditions" USING btree ("_order");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "personas__order_idx";
  DROP INDEX "conditions__order_idx";
  ALTER TABLE "personas" DROP COLUMN "_order";
  ALTER TABLE "conditions" DROP COLUMN "_order";`)
}
