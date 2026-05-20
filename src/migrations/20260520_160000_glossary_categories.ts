import {
	type MigrateUpArgs,
	type MigrateDownArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
		CREATE TABLE "glossary_categories" (
			"id" serial PRIMARY KEY NOT NULL,
			"name" varchar NOT NULL,
			"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
			"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
		);

		CREATE UNIQUE INDEX "glossary_categories_name_idx" ON "glossary_categories" USING btree ("name");
		CREATE INDEX "glossary_categories_updated_at_idx" ON "glossary_categories" USING btree ("updated_at");
		CREATE INDEX "glossary_categories_created_at_idx" ON "glossary_categories" USING btree ("created_at");

		ALTER TABLE "glossary" ADD COLUMN "category_id" integer;
		ALTER TABLE "glossary"
			ADD CONSTRAINT "glossary_category_id_glossary_categories_id_fk"
			FOREIGN KEY ("category_id") REFERENCES "public"."glossary_categories"("id")
			ON DELETE set null ON UPDATE no action;
		CREATE INDEX "glossary_category_idx" ON "glossary" USING btree ("category_id");

		ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "glossary_categories_id" integer;
		ALTER TABLE "payload_locked_documents_rels"
			ADD CONSTRAINT "payload_locked_documents_rels_glossary_categories_fk"
			FOREIGN KEY ("glossary_categories_id") REFERENCES "public"."glossary_categories"("id")
			ON DELETE cascade ON UPDATE no action;
		CREATE INDEX "payload_locked_documents_rels_glossary_categories_id_idx"
			ON "payload_locked_documents_rels" USING btree ("glossary_categories_id");
	`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
		DROP INDEX IF EXISTS "payload_locked_documents_rels_glossary_categories_id_idx";
		ALTER TABLE "payload_locked_documents_rels"
			DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_glossary_categories_fk";
		ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "glossary_categories_id";

		DROP INDEX IF EXISTS "glossary_category_idx";
		ALTER TABLE "glossary" DROP CONSTRAINT IF EXISTS "glossary_category_id_glossary_categories_id_fk";
		ALTER TABLE "glossary" DROP COLUMN IF EXISTS "category_id";

		DROP TABLE IF EXISTS "glossary_categories" CASCADE;
	`);
}
