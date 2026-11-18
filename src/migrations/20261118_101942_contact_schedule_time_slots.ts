import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

const slotsTable = (day: string) => `home_blocks_contact_phone_schedule_${day}_slots`

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const day of DAYS) {
    const table = slotsTable(day)
    await db.execute(
      sql.raw(`
   CREATE TABLE "${table}" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"open_time" timestamp(3) with time zone,
  	"close_time" timestamp(3) with time zone
  );
  ALTER TABLE "${table}" ADD CONSTRAINT "${table}_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_contact"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "${table}_order_idx" ON "${table}" USING btree ("_order");
  CREATE INDEX "${table}_parent_id_idx" ON "${table}" USING btree ("_parent_id");`),
    )
    // The current hours of the day become its first slot. Ids mimic the
    // 24-hex ObjectIds Payload gives array rows.
    await db.execute(
      sql.raw(`
   INSERT INTO "${table}" ("_order", "_parent_id", "id", "open_time", "close_time")
  SELECT 1, "id", substr(md5(random()::text || "id"), 1, 24), "phone_schedule_${day}_open_time", "phone_schedule_${day}_close_time"
  FROM "home_blocks_contact"
  WHERE "phone_schedule_${day}_open_time" IS NOT NULL OR "phone_schedule_${day}_close_time" IS NOT NULL;
  ALTER TABLE "home_blocks_contact" DROP COLUMN "phone_schedule_${day}_open_time";
  ALTER TABLE "home_blocks_contact" DROP COLUMN "phone_schedule_${day}_close_time";`),
    )
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  for (const day of DAYS) {
    const table = slotsTable(day)
    // Only one slot per day fits the former columns: keep the first one
    await db.execute(
      sql.raw(`
   ALTER TABLE "home_blocks_contact" ADD COLUMN "phone_schedule_${day}_open_time" timestamp(3) with time zone;
  ALTER TABLE "home_blocks_contact" ADD COLUMN "phone_schedule_${day}_close_time" timestamp(3) with time zone;
  UPDATE "home_blocks_contact" AS contact
  SET "phone_schedule_${day}_open_time" = first_slot."open_time", "phone_schedule_${day}_close_time" = first_slot."close_time"
  FROM (
    SELECT DISTINCT ON ("_parent_id") "_parent_id", "open_time", "close_time"
    FROM "${table}"
    ORDER BY "_parent_id", "_order"
  ) AS first_slot
  WHERE first_slot."_parent_id" = contact."id";
  DROP TABLE "${table}" CASCADE;`),
    )
  }
}
