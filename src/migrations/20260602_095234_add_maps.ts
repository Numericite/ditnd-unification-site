import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_map_categories_custom_fields_type" AS ENUM('checkbox', 'text', 'select');
  CREATE TYPE "public"."enum_map_categories_color_variant" AS ENUM('green-tilleul-verveine', 'green-bourgeon', 'green-emeraude', 'green-menthe', 'green-archipel', 'blue-ecume', 'blue-cumulus', 'purple-glycine', 'pink-macaron', 'pink-tuile', 'yellow-tournesol', 'yellow-moutarde', 'orange-terre-battue', 'brown-cafe-creme', 'brown-caramel', 'brown-opera', 'beige-gris-galet');
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
  
  CREATE TABLE "map_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"color_variant" "enum_map_categories_color_variant",
  	"icon_id" varchar,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "map_markers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"category_id" integer NOT NULL,
  	"address" varchar NOT NULL,
  	"postal_code" varchar,
  	"city" varchar NOT NULL,
  	"latitude" numeric,
  	"longitude" numeric,
  	"phone" varchar,
  	"email" varchar,
  	"website" varchar,
  	"description" varchar,
  	"metadata" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "maps" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"allow_filter_by_category" boolean DEFAULT true,
  	"allow_filter_by_region" boolean DEFAULT true,
  	"allow_filter_by_departement" boolean DEFAULT true,
  	"allowed_custom_field_filters" jsonb DEFAULT '[]'::jsonb,
  	"default_latitude" numeric DEFAULT 46.6,
  	"default_longitude" numeric DEFAULT 2.3,
  	"default_zoom" numeric DEFAULT 5,
  	"fit_to_markers" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "maps_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"map_categories_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "map_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "map_markers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "maps_id" integer;
  ALTER TABLE "map_categories_custom_fields_options" ADD CONSTRAINT "map_categories_custom_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."map_categories_custom_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "map_categories_custom_fields" ADD CONSTRAINT "map_categories_custom_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."map_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "map_markers" ADD CONSTRAINT "map_markers_category_id_map_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."map_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "maps_rels" ADD CONSTRAINT "maps_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "maps_rels" ADD CONSTRAINT "maps_rels_map_categories_fk" FOREIGN KEY ("map_categories_id") REFERENCES "public"."map_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "map_categories_custom_fields_options_order_idx" ON "map_categories_custom_fields_options" USING btree ("_order");
  CREATE INDEX "map_categories_custom_fields_options_parent_id_idx" ON "map_categories_custom_fields_options" USING btree ("_parent_id");
  CREATE INDEX "map_categories_custom_fields_order_idx" ON "map_categories_custom_fields" USING btree ("_order");
  CREATE INDEX "map_categories_custom_fields_parent_id_idx" ON "map_categories_custom_fields" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "map_categories_slug_idx" ON "map_categories" USING btree ("slug");
  CREATE INDEX "map_categories_updated_at_idx" ON "map_categories" USING btree ("updated_at");
  CREATE INDEX "map_categories_created_at_idx" ON "map_categories" USING btree ("created_at");
  CREATE INDEX "map_markers_category_idx" ON "map_markers" USING btree ("category_id");
  CREATE INDEX "map_markers_updated_at_idx" ON "map_markers" USING btree ("updated_at");
  CREATE INDEX "map_markers_created_at_idx" ON "map_markers" USING btree ("created_at");
  CREATE UNIQUE INDEX "maps_slug_idx" ON "maps" USING btree ("slug");
  CREATE INDEX "maps_updated_at_idx" ON "maps" USING btree ("updated_at");
  CREATE INDEX "maps_created_at_idx" ON "maps" USING btree ("created_at");
  CREATE INDEX "maps_rels_order_idx" ON "maps_rels" USING btree ("order");
  CREATE INDEX "maps_rels_parent_idx" ON "maps_rels" USING btree ("parent_id");
  CREATE INDEX "maps_rels_path_idx" ON "maps_rels" USING btree ("path");
  CREATE INDEX "maps_rels_map_categories_id_idx" ON "maps_rels" USING btree ("map_categories_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_map_categories_fk" FOREIGN KEY ("map_categories_id") REFERENCES "public"."map_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_map_markers_fk" FOREIGN KEY ("map_markers_id") REFERENCES "public"."map_markers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_maps_fk" FOREIGN KEY ("maps_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_map_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("map_categories_id");
  CREATE INDEX "payload_locked_documents_rels_map_markers_id_idx" ON "payload_locked_documents_rels" USING btree ("map_markers_id");
  CREATE INDEX "payload_locked_documents_rels_maps_id_idx" ON "payload_locked_documents_rels" USING btree ("maps_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "map_categories_custom_fields_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "map_categories_custom_fields" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "map_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "map_markers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "maps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "maps_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "map_categories_custom_fields_options" CASCADE;
  DROP TABLE "map_categories_custom_fields" CASCADE;
  DROP TABLE "map_categories" CASCADE;
  DROP TABLE "map_markers" CASCADE;
  DROP TABLE "maps" CASCADE;
  DROP TABLE "maps_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_map_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_map_markers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_maps_fk";
  
  DROP INDEX "payload_locked_documents_rels_map_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_map_markers_id_idx";
  DROP INDEX "payload_locked_documents_rels_maps_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "map_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "map_markers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "maps_id";
  DROP TYPE "public"."enum_map_categories_custom_fields_type";
  DROP TYPE "public"."enum_map_categories_color_variant";`)
}
