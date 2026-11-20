import config from "@payload-config";
import { sql } from "@payloadcms/db-postgres";
import { getPayload } from "payload";

/**
 * Supprime les vecteurs de recherche sémantique des guides et formations qui
 * ne sont plus publiés.
 *
 * Jusqu'au correctif du hook afterChange, la vérification de dépublication
 * lisait hors de la transaction et voyait encore la version publiée : le
 * vecteur restait en base. À lancer une fois. Idempotent.
 *
 * Usage : yarn purge:vectors
 */

const run = async () => {
	const payload = await getPayload({ config });
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const drizzle = (payload.db as any).drizzle;

	const guides = await drizzle.execute(sql`
		DELETE FROM practical_guide_search_vectors
		WHERE doc_id NOT IN (SELECT id::text FROM practical_guides WHERE _status = 'published')
		RETURNING doc_id
	`);
	const courses = await drizzle.execute(sql`
		DELETE FROM courses_search_vectors
		WHERE doc_id NOT IN (SELECT id::text FROM courses WHERE _status = 'published')
		RETURNING doc_id
	`);

	const ids = (rows: { doc_id: string }[]) =>
		rows.map((row) => row.doc_id).join(", ") || "aucun";
	console.log(
		`Guides : ${guides.rows.length} vecteur(s) supprimé(s) (${ids(guides.rows)}).`,
	);
	console.log(
		`Formations : ${courses.rows.length} vecteur(s) supprimé(s) (${ids(courses.rows)}).`,
	);
};

try {
	await run();
} catch (error) {
	console.error("Purge des vecteurs échouée :", error);
	process.exitCode = 1;
} finally {
	process.exit();
}
