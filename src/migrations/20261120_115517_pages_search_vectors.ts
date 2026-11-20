import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Vecteurs de recherche sémantique des pages, pour la recherche globale et le
// chatbot. Le hook afterChange n'indexe une page qu'à sa publication : lancer
// `yarn reindex:pages` une fois la migration appliquée.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "pages_search_vectors" (
  	"doc_id" text PRIMARY KEY NOT NULL,
  	"text" text NOT NULL,
  	"embedding" vector(1024) NOT NULL
  );
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_search_vectors" CASCADE;`)
}
