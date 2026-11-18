import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const DAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

const slotsTable = (day: string) => `home_blocks_contact_phone_schedule_${day}_slots`

type Slot = [open: string, close: string]

const WEEKDAY_SLOTS: Slot[] = [
  ['09:00', '13:00'],
  ['14:00', '17:00'],
]

// Official hours of the phone line, applied to the existing contact blocks
const SCHEDULE: Record<string, Slot[]> = {
  lundi: WEEKDAY_SLOTS,
  mardi: [...WEEKDAY_SLOTS, ['18:00', '20:00']],
  mercredi: WEEKDAY_SLOTS,
  jeudi: WEEKDAY_SLOTS,
  vendredi: WEEKDAY_SLOTS,
  samedi: [],
  dimanche: [],
}

// Stored like the admin time picker does: a Paris time on a fixed date
const parisTime = (hhmm: string) => `2026-01-01T${hhmm}:00+01:00`

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const day of DAYS) {
    const table = slotsTable(day)
    const slots = SCHEDULE[day] ?? []
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
  CREATE INDEX "${table}_parent_id_idx" ON "${table}" USING btree ("_parent_id");
  ALTER TABLE "home_blocks_contact" DROP COLUMN "phone_schedule_${day}_open_time";
  ALTER TABLE "home_blocks_contact" DROP COLUMN "phone_schedule_${day}_close_time";
  UPDATE "home_blocks_contact" SET "phone_schedule_${day}_closed" = ${slots.length === 0};`),
    )
    if (slots.length === 0) continue
    const values = slots
      .map(([open, close], index) => `(${index + 1}, '${parisTime(open)}'::timestamptz, '${parisTime(close)}'::timestamptz)`)
      .join(', ')
    // Ids mimic the 24-hex ObjectIds Payload gives array rows
    await db.execute(
      sql.raw(`
   INSERT INTO "${table}" ("_order", "_parent_id", "id", "open_time", "close_time")
  SELECT slot.position, contact."id", substr(md5(random()::text || contact."id" || slot.position), 1, 24), slot.open_time, slot.close_time
  FROM "home_blocks_contact" AS contact
  CROSS JOIN (VALUES ${values}) AS slot(position, open_time, close_time);`),
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
