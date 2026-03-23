import {
  type MigrateUpArgs,
  type MigrateDownArgs,
  sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "practical_guide_search_vectors" (
  	"doc_id" text PRIMARY KEY NOT NULL,
  	"text" text NOT NULL,
  	"embedding" vector(1536) NOT NULL
  );`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "practical_guide_search_vectors" CASCADE;`);
}
