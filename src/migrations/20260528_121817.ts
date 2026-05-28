import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_map_categories_color_variant" AS ENUM('green-tilleul-verveine', 'green-bourgeon', 'green-emeraude', 'green-menthe', 'green-archipel', 'blue-ecume', 'blue-cumulus', 'purple-glycine', 'pink-macaron', 'pink-tuile', 'yellow-tournesol', 'yellow-moutarde', 'orange-terre-battue', 'brown-cafe-creme', 'brown-caramel', 'brown-opera', 'beige-gris-galet');
  CREATE TABLE "glossary" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"category_id" integer,
  	"link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "glossary_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  
  ALTER TABLE "practical_guide_search_vectors" ALTER COLUMN "embedding" SET DATA TYPE vector(1024);
  ALTER TABLE "courses_search_vectors" ALTER COLUMN "embedding" SET DATA TYPE vector(1024);
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "glossary_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "glossary_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "map_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "map_markers_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "maps_id" integer;
  ALTER TABLE "footer" ADD COLUMN "contact_pros_cra_title" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "contact_pros_cra_image_banner_id" integer;
  ALTER TABLE "footer" ADD COLUMN "contact_pros_cra_content" jsonb NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "contact_particuliers_title" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "contact_particuliers_image_banner_id" integer;
  ALTER TABLE "footer" ADD COLUMN "contact_particuliers_content" jsonb NOT NULL;
  ALTER TABLE "glossary" ADD CONSTRAINT "glossary_category_id_glossary_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."glossary_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "map_markers" ADD CONSTRAINT "map_markers_category_id_map_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."map_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "maps_rels" ADD CONSTRAINT "maps_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "maps_rels" ADD CONSTRAINT "maps_rels_map_categories_fk" FOREIGN KEY ("map_categories_id") REFERENCES "public"."map_categories"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "glossary_category_idx" ON "glossary" USING btree ("category_id");
  CREATE INDEX "glossary_updated_at_idx" ON "glossary" USING btree ("updated_at");
  CREATE INDEX "glossary_created_at_idx" ON "glossary" USING btree ("created_at");
  CREATE UNIQUE INDEX "glossary_categories_name_idx" ON "glossary_categories" USING btree ("name");
  CREATE INDEX "glossary_categories_updated_at_idx" ON "glossary_categories" USING btree ("updated_at");
  CREATE INDEX "glossary_categories_created_at_idx" ON "glossary_categories" USING btree ("created_at");
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
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_glossary_fk" FOREIGN KEY ("glossary_id") REFERENCES "public"."glossary"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_glossary_categories_fk" FOREIGN KEY ("glossary_categories_id") REFERENCES "public"."glossary_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_map_categories_fk" FOREIGN KEY ("map_categories_id") REFERENCES "public"."map_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_map_markers_fk" FOREIGN KEY ("map_markers_id") REFERENCES "public"."map_markers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_maps_fk" FOREIGN KEY ("maps_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_contact_pros_cra_image_banner_id_medias_id_fk" FOREIGN KEY ("contact_pros_cra_image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_contact_particuliers_image_banner_id_medias_id_fk" FOREIGN KEY ("contact_particuliers_image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_glossary_id_idx" ON "payload_locked_documents_rels" USING btree ("glossary_id");
  CREATE INDEX "payload_locked_documents_rels_glossary_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("glossary_categories_id");
  CREATE INDEX "payload_locked_documents_rels_map_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("map_categories_id");
  CREATE INDEX "payload_locked_documents_rels_map_markers_id_idx" ON "payload_locked_documents_rels" USING btree ("map_markers_id");
  CREATE INDEX "payload_locked_documents_rels_maps_id_idx" ON "payload_locked_documents_rels" USING btree ("maps_id");
  CREATE INDEX "footer_contact_pros_cra_contact_pros_cra_image_banner_idx" ON "footer" USING btree ("contact_pros_cra_image_banner_id");
  CREATE INDEX "footer_contact_particuliers_contact_particuliers_image_b_idx" ON "footer" USING btree ("contact_particuliers_image_banner_id");
  ALTER TABLE "footer" DROP COLUMN "cgu_title";
  ALTER TABLE "footer" DROP COLUMN "cgu_content";
  ALTER TABLE "footer" DROP COLUMN "terms_of_use_title";
  ALTER TABLE "footer" DROP COLUMN "terms_of_use_content";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "glossary" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "glossary_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "map_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "map_markers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "maps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "maps_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "glossary" CASCADE;
  DROP TABLE "glossary_categories" CASCADE;
  DROP TABLE "map_categories" CASCADE;
  DROP TABLE "map_markers" CASCADE;
  DROP TABLE "maps" CASCADE;
  DROP TABLE "maps_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_glossary_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_glossary_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_map_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_map_markers_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_maps_fk";
  
  ALTER TABLE "footer" DROP CONSTRAINT "footer_contact_pros_cra_image_banner_id_medias_id_fk";
  
  ALTER TABLE "footer" DROP CONSTRAINT "footer_contact_particuliers_image_banner_id_medias_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_glossary_id_idx";
  DROP INDEX "payload_locked_documents_rels_glossary_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_map_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_map_markers_id_idx";
  DROP INDEX "payload_locked_documents_rels_maps_id_idx";
  DROP INDEX "footer_contact_pros_cra_contact_pros_cra_image_banner_idx";
  DROP INDEX "footer_contact_particuliers_contact_particuliers_image_b_idx";
  ALTER TABLE "practical_guide_search_vectors" ALTER COLUMN "embedding" SET DATA TYPE vector(1536);
  ALTER TABLE "courses_search_vectors" ALTER COLUMN "embedding" SET DATA TYPE vector(1536);
  ALTER TABLE "footer" ADD COLUMN "cgu_title" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "cgu_content" jsonb NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "terms_of_use_title" varchar NOT NULL;
  ALTER TABLE "footer" ADD COLUMN "terms_of_use_content" jsonb NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "glossary_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "glossary_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "map_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "map_markers_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "maps_id";
  ALTER TABLE "footer" DROP COLUMN "contact_pros_cra_title";
  ALTER TABLE "footer" DROP COLUMN "contact_pros_cra_image_banner_id";
  ALTER TABLE "footer" DROP COLUMN "contact_pros_cra_content";
  ALTER TABLE "footer" DROP COLUMN "contact_particuliers_title";
  ALTER TABLE "footer" DROP COLUMN "contact_particuliers_image_banner_id";
  ALTER TABLE "footer" DROP COLUMN "contact_particuliers_content";
  DROP TYPE "public"."enum_map_categories_color_variant";`)
}
