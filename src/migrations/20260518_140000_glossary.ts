import {
	type MigrateUpArgs,
	type MigrateDownArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
		CREATE TABLE "glossary" (
			"id" serial PRIMARY KEY NOT NULL,
			"name" varchar NOT NULL,
			"description" varchar NOT NULL,
			"link" varchar,
			"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
			"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
		);

		CREATE INDEX "glossary_updated_at_idx" ON "glossary" USING btree ("updated_at");
		CREATE INDEX "glossary_created_at_idx" ON "glossary" USING btree ("created_at");

		ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "glossary_id" integer;
		ALTER TABLE "payload_locked_documents_rels"
			ADD CONSTRAINT "payload_locked_documents_rels_glossary_fk"
			FOREIGN KEY ("glossary_id") REFERENCES "public"."glossary"("id")
			ON DELETE cascade ON UPDATE no action;
		CREATE INDEX "payload_locked_documents_rels_glossary_id_idx"
			ON "payload_locked_documents_rels" USING btree ("glossary_id");
	`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
		DROP INDEX IF EXISTS "payload_locked_documents_rels_glossary_id_idx";
		ALTER TABLE "payload_locked_documents_rels"
			DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_glossary_fk";
		ALTER TABLE "payload_locked_documents_rels" DROP COLUMN IF EXISTS "glossary_id";

		DROP TABLE IF EXISTS "glossary" CASCADE;
	`);
}
