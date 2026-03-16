import {
  type MigrateUpArgs,
  type MigrateDownArgs,
  sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "practical_guide_vectors" (
  	"doc_id" text PRIMARY KEY NOT NULL,
  	"text" text NOT NULL,
  	"embedding" vector(1536) NOT NULL
  );
  
  CREATE TABLE "search_results" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"slug" varchar,
  	"description" varchar,
  	"content_text" varchar,
  	"condition_names" varchar,
  	"theme_names" varchar,
  	"persona_names" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "search_results_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"practical_guides_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "search_results_id" integer;
  ALTER TABLE "search_results_rels" ADD CONSTRAINT "search_results_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_results_rels" ADD CONSTRAINT "search_results_rels_practical_guides_fk" FOREIGN KEY ("practical_guides_id") REFERENCES "public"."practical_guides"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "search_results_updated_at_idx" ON "search_results" USING btree ("updated_at");
  CREATE INDEX "search_results_created_at_idx" ON "search_results" USING btree ("created_at");
  CREATE INDEX "search_results_rels_order_idx" ON "search_results_rels" USING btree ("order");
  CREATE INDEX "search_results_rels_parent_idx" ON "search_results_rels" USING btree ("parent_id");
  CREATE INDEX "search_results_rels_path_idx" ON "search_results_rels" USING btree ("path");
  CREATE INDEX "search_results_rels_practical_guides_id_idx" ON "search_results_rels" USING btree ("practical_guides_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_results_fk" FOREIGN KEY ("search_results_id") REFERENCES "public"."search_results"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_search_results_id_idx" ON "payload_locked_documents_rels" USING btree ("search_results_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "practical_guide_vectors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_results" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_results_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "practical_guide_vectors" CASCADE;
  DROP TABLE "search_results" CASCADE;
  DROP TABLE "search_results_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_search_results_fk";
  
  DROP INDEX "payload_locked_documents_rels_search_results_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "search_results_id";`);
}
