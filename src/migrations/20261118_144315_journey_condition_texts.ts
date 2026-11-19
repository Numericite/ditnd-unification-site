import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Idempotent: the table may already exist where 20261117_161657_journey_condition_texts ran
// before this migration was renamed to sort after staging's migrations.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "journeys_condition_texts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"condition_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL
  );

  DO $$ BEGIN
   ALTER TABLE "journeys_condition_texts" ADD CONSTRAINT "journeys_condition_texts_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
   ALTER TABLE "journeys_condition_texts" ADD CONSTRAINT "journeys_condition_texts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "journeys_condition_texts_order_idx" ON "journeys_condition_texts" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "journeys_condition_texts_parent_id_idx" ON "journeys_condition_texts" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "journeys_condition_texts_condition_idx" ON "journeys_condition_texts" USING btree ("condition_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "journeys_condition_texts" CASCADE;`)
}
