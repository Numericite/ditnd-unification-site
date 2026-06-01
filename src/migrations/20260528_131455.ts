import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_map_categories_custom_fields_type" AS ENUM('checkbox', 'text', 'number', 'select');
  CREATE TABLE "map_categories_custom_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "map_categories_custom_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"key" varchar NOT NULL,
  	"type" "enum_map_categories_custom_fields_type" DEFAULT 'text' NOT NULL
  );
  
  ALTER TABLE "map_markers" ADD COLUMN "metadata" jsonb;
  ALTER TABLE "map_categories_custom_fields_options" ADD CONSTRAINT "map_categories_custom_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."map_categories_custom_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "map_categories_custom_fields" ADD CONSTRAINT "map_categories_custom_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."map_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "map_categories_custom_fields_options_order_idx" ON "map_categories_custom_fields_options" USING btree ("_order");
  CREATE INDEX "map_categories_custom_fields_options_parent_id_idx" ON "map_categories_custom_fields_options" USING btree ("_parent_id");
  CREATE INDEX "map_categories_custom_fields_order_idx" ON "map_categories_custom_fields" USING btree ("_order");
  CREATE INDEX "map_categories_custom_fields_parent_id_idx" ON "map_categories_custom_fields" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "map_categories_custom_fields_options" CASCADE;
  DROP TABLE "map_categories_custom_fields" CASCADE;
  ALTER TABLE "map_markers" DROP COLUMN "metadata";
  DROP TYPE "public"."enum_map_categories_custom_fields_type";`)
}
