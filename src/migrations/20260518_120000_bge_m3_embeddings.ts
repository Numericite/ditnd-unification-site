import {
	type MigrateUpArgs,
	type MigrateDownArgs,
	sql,
} from "@payloadcms/db-postgres";

// Switch embedding tables from OpenAI text-embedding-3-small (1536 dims)
// to Albert API BAAI/bge-m3 (1024 dims). Existing embeddings are wiped;
// they are regenerated lazily by the afterChange hooks on next publish.
export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`DROP TABLE IF EXISTS "practical_guide_search_vectors" CASCADE;`);
	await db.execute(sql`
		CREATE TABLE "practical_guide_search_vectors" (
			"doc_id" text PRIMARY KEY NOT NULL,
			"text" text NOT NULL,
			"embedding" vector(1024) NOT NULL
		);
	`);

	await db.execute(sql`DROP TABLE IF EXISTS "courses_search_vectors" CASCADE;`);
	await db.execute(sql`
		CREATE TABLE "courses_search_vectors" (
			"doc_id" text PRIMARY KEY NOT NULL,
			"text" text NOT NULL,
			"embedding" vector(1024) NOT NULL
		);
	`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`DROP TABLE IF EXISTS "practical_guide_search_vectors" CASCADE;`);
	await db.execute(sql`
		CREATE TABLE "practical_guide_search_vectors" (
			"doc_id" text PRIMARY KEY NOT NULL,
			"text" text NOT NULL,
			"embedding" vector(1536) NOT NULL
		);
	`);

	await db.execute(sql`DROP TABLE IF EXISTS "courses_search_vectors" CASCADE;`);
	await db.execute(sql`
		CREATE TABLE "courses_search_vectors" (
			"doc_id" text PRIMARY KEY NOT NULL,
			"text" text NOT NULL,
			"embedding" vector(1536) NOT NULL
		);
	`);
}
