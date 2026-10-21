import {
	type MigrateUpArgs,
	type MigrateDownArgs,
	sql,
} from "@payloadcms/db-postgres";

// Des lignes insérées avec un id explicite (import/restauration de données)
// ont laissé les séquences derrière max(id) : chaque création tombait sur un
// id déjà pris et Payload remontait « Le champ suivant n'est pas valide : id ».
export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
		SELECT setval(
			pg_get_serial_sequence('"glossary_categories"', 'id'),
			COALESCE((SELECT MAX("id") FROM "glossary_categories"), 1),
			(SELECT MAX("id") IS NOT NULL FROM "glossary_categories")
		);
		SELECT setval(
			pg_get_serial_sequence('"glossary"', 'id'),
			COALESCE((SELECT MAX("id") FROM "glossary"), 1),
			(SELECT MAX("id") IS NOT NULL FROM "glossary")
		);
	`);
}

export async function down(_args: MigrateDownArgs): Promise<void> {
	// Rien à annuler : resynchroniser une séquence est idempotent.
}
