import {
	type MigrateUpArgs,
	type MigrateDownArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
		CREATE TABLE "map_categories" (
			"id" serial PRIMARY KEY NOT NULL,
			"name" varchar NOT NULL,
			"slug" varchar NOT NULL,
			"color_variant" varchar,
			"icon_id" varchar,
			"description" varchar,
			"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
			"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
		);

		CREATE UNIQUE INDEX "map_categories_slug_idx" ON "map_categories" USING btree ("slug");
		CREATE INDEX "map_categories_updated_at_idx" ON "map_categories" USING btree ("updated_at");
		CREATE INDEX "map_categories_created_at_idx" ON "map_categories" USING btree ("created_at");

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

		ALTER TABLE "map_markers"
			ADD CONSTRAINT "map_markers_category_id_map_categories_id_fk"
			FOREIGN KEY ("category_id") REFERENCES "public"."map_categories"("id")
			ON DELETE set null ON UPDATE no action;

		CREATE INDEX "map_markers_category_idx" ON "map_markers" USING btree ("category_id");
		CREATE INDEX "map_markers_updated_at_idx" ON "map_markers" USING btree ("updated_at");
		CREATE INDEX "map_markers_created_at_idx" ON "map_markers" USING btree ("created_at");

		CREATE TABLE "maps" (
			"id" serial PRIMARY KEY NOT NULL,
			"name" varchar NOT NULL,
			"slug" varchar NOT NULL,
			"title" varchar,
			"description" varchar,
			"default_latitude" numeric DEFAULT 46.6,
			"default_longitude" numeric DEFAULT 2.3,
			"default_zoom" numeric DEFAULT 5,
			"fit_to_markers" boolean DEFAULT true,
			"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
			"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
		);

		CREATE UNIQUE INDEX "maps_slug_idx" ON "maps" USING btree ("slug");
		CREATE INDEX "maps_updated_at_idx" ON "maps" USING btree ("updated_at");
		CREATE INDEX "maps_created_at_idx" ON "maps" USING btree ("created_at");

		CREATE TABLE "maps_rels" (
			"id" serial PRIMARY KEY NOT NULL,
			"order" integer,
			"parent_id" integer NOT NULL,
			"path" varchar NOT NULL,
			"map_categories_id" integer
		);

		ALTER TABLE "maps_rels"
			ADD CONSTRAINT "maps_rels_parent_fk"
			FOREIGN KEY ("parent_id") REFERENCES "public"."maps"("id")
			ON DELETE cascade ON UPDATE no action;
		ALTER TABLE "maps_rels"
			ADD CONSTRAINT "maps_rels_map_categories_fk"
			FOREIGN KEY ("map_categories_id") REFERENCES "public"."map_categories"("id")
			ON DELETE cascade ON UPDATE no action;

		CREATE INDEX "maps_rels_order_idx" ON "maps_rels" USING btree ("order");
		CREATE INDEX "maps_rels_parent_idx" ON "maps_rels" USING btree ("parent_id");
		CREATE INDEX "maps_rels_path_idx" ON "maps_rels" USING btree ("path");
		CREATE INDEX "maps_rels_map_categories_id_idx" ON "maps_rels" USING btree ("map_categories_id");

		ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "map_categories_id" integer;
		ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "map_markers_id" integer;
		ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "maps_id" integer;

		ALTER TABLE "payload_locked_documents_rels"
			ADD CONSTRAINT "payload_locked_documents_rels_map_categories_fk"
			FOREIGN KEY ("map_categories_id") REFERENCES "public"."map_categories"("id")
			ON DELETE cascade ON UPDATE no action;
		ALTER TABLE "payload_locked_documents_rels"
			ADD CONSTRAINT "payload_locked_documents_rels_map_markers_fk"
			FOREIGN KEY ("map_markers_id") REFERENCES "public"."map_markers"("id")
			ON DELETE cascade ON UPDATE no action;
		ALTER TABLE "payload_locked_documents_rels"
			ADD CONSTRAINT "payload_locked_documents_rels_maps_fk"
			FOREIGN KEY ("maps_id") REFERENCES "public"."maps"("id")
			ON DELETE cascade ON UPDATE no action;

		CREATE INDEX "payload_locked_documents_rels_map_categories_id_idx"
			ON "payload_locked_documents_rels" USING btree ("map_categories_id");
		CREATE INDEX "payload_locked_documents_rels_map_markers_id_idx"
			ON "payload_locked_documents_rels" USING btree ("map_markers_id");
		CREATE INDEX "payload_locked_documents_rels_maps_id_idx"
			ON "payload_locked_documents_rels" USING btree ("maps_id");

		ALTER TABLE "practical_guides_rels" ADD COLUMN "maps_id" integer;
		ALTER TABLE "practical_guides_rels"
			ADD CONSTRAINT "practical_guides_rels_maps_fk"
			FOREIGN KEY ("maps_id") REFERENCES "public"."maps"("id")
			ON DELETE cascade ON UPDATE no action;
		CREATE INDEX "practical_guides_rels_maps_id_idx"
			ON "practical_guides_rels" USING btree ("maps_id");

		ALTER TABLE "_practical_guides_v_rels" ADD COLUMN "maps_id" integer;
		ALTER TABLE "_practical_guides_v_rels"
			ADD CONSTRAINT "_practical_guides_v_rels_maps_fk"
			FOREIGN KEY ("maps_id") REFERENCES "public"."maps"("id")
			ON DELETE cascade ON UPDATE no action;
		CREATE INDEX "_practical_guides_v_rels_maps_id_idx"
			ON "_practical_guides_v_rels" USING btree ("maps_id");
	`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
		DROP INDEX IF EXISTS "_practical_guides_v_rels_maps_id_idx";
		ALTER TABLE "_practical_guides_v_rels"
			DROP CONSTRAINT IF EXISTS "_practical_guides_v_rels_maps_fk";
		ALTER TABLE "_practical_guides_v_rels" DROP COLUMN IF EXISTS "maps_id";

		DROP INDEX IF EXISTS "practical_guides_rels_maps_id_idx";
		ALTER TABLE "practical_guides_rels"
			DROP CONSTRAINT IF EXISTS "practical_guides_rels_maps_fk";
		ALTER TABLE "practical_guides_rels" DROP COLUMN IF EXISTS "maps_id";

		DROP INDEX IF EXISTS "payload_locked_documents_rels_maps_id_idx";
		DROP INDEX IF EXISTS "payload_locked_documents_rels_map_markers_id_idx";
		DROP INDEX IF EXISTS "payload_locked_documents_rels_map_categories_id_idx";
		ALTER TABLE "payload_locked_documents_rels"
			DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_maps_fk";
		ALTER TABLE "payload_locked_documents_rels"
			DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_map_markers_fk";
		ALTER TABLE "payload_locked_documents_rels"
			DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_map_categories_fk";
		ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "maps_id";
		ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "map_markers_id";
		ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "map_categories_id";

		DROP TABLE IF EXISTS "maps_rels" CASCADE;
		DROP TABLE IF EXISTS "maps" CASCADE;
		DROP TABLE IF EXISTS "map_markers" CASCADE;
		DROP TABLE IF EXISTS "map_categories" CASCADE;
	`);
}
