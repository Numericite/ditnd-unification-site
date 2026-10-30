import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_menu_items_children_link_type" AS ENUM('reference', 'internal', 'external');
  CREATE TYPE "public"."enum_menu_items_kind" AS ENUM('link', 'submenu');
  CREATE TYPE "public"."enum_menu_items_link_type" AS ENUM('reference', 'internal', 'external');
  CREATE TABLE "menu_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"link_type" "enum_menu_items_children_link_type" DEFAULT 'reference',
  	"link_internal_url" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"kind" "enum_menu_items_kind" DEFAULT 'link' NOT NULL,
  	"link_type" "enum_menu_items_link_type" DEFAULT 'reference',
  	"link_internal_url" varchar,
  	"link_external_url" varchar
  );
  
  CREATE TABLE "menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "menu_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"practical_guides_id" integer,
  	"courses_id" integer
  );
  
  ALTER TABLE "menu_items_children" ADD CONSTRAINT "menu_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_rels" ADD CONSTRAINT "menu_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_rels" ADD CONSTRAINT "menu_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_rels" ADD CONSTRAINT "menu_rels_practical_guides_fk" FOREIGN KEY ("practical_guides_id") REFERENCES "public"."practical_guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_rels" ADD CONSTRAINT "menu_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "menu_items_children_order_idx" ON "menu_items_children" USING btree ("_order");
  CREATE INDEX "menu_items_children_parent_id_idx" ON "menu_items_children" USING btree ("_parent_id");
  CREATE INDEX "menu_items_order_idx" ON "menu_items" USING btree ("_order");
  CREATE INDEX "menu_items_parent_id_idx" ON "menu_items" USING btree ("_parent_id");
  CREATE INDEX "menu_rels_order_idx" ON "menu_rels" USING btree ("order");
  CREATE INDEX "menu_rels_parent_idx" ON "menu_rels" USING btree ("parent_id");
  CREATE INDEX "menu_rels_path_idx" ON "menu_rels" USING btree ("path");
  CREATE INDEX "menu_rels_pages_id_idx" ON "menu_rels" USING btree ("pages_id");
  CREATE INDEX "menu_rels_practical_guides_id_idx" ON "menu_rels" USING btree ("practical_guides_id");
  CREATE INDEX "menu_rels_courses_id_idx" ON "menu_rels" USING btree ("courses_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "menu_items_children" CASCADE;
  DROP TABLE "menu_items" CASCADE;
  DROP TABLE "menu" CASCADE;
  DROP TABLE "menu_rels" CASCADE;
  DROP TYPE "public"."enum_menu_items_children_link_type";
  DROP TYPE "public"."enum_menu_items_kind";
  DROP TYPE "public"."enum_menu_items_link_type";`)
}
