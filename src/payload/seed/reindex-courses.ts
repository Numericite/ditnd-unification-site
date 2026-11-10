import config from "@payload-config";
import { getPayload } from "payload";
import { indexCourseSearchVector } from "../collections/Courses";

/**
 * Recalcule les vecteurs de recherche sémantique de toutes les formations
 * publiées (table courses_search_vectors).
 *
 * Le hook afterChange ne réindexe une formation qu'à son enregistrement : une
 * migration qui modifie les données en SQL (ex. 20261023_123734, « Type de
 * ressource » → « Format » + « Durée ») laisse donc l'ancien texte indexé.
 * À lancer après `payload migrate`. Idempotent : chaque vecteur est remplacé.
 *
 * Usage : yarn reindex:courses
 */

const run = async () => {
	const payload = await getPayload({ config });

	const { docs } = await payload.find({
		collection: "courses",
		where: { _status: { equals: "published" } },
		depth: 0,
		pagination: false,
		overrideAccess: true,
	});

	let indexed = 0;
	const failed: number[] = [];
	// Séquentiel : chaque formation appelle l'API d'embeddings.
	for (const doc of docs) {
		try {
			await indexCourseSearchVector(payload, doc);
			indexed++;
		} catch (err) {
			failed.push(doc.id);
			console.error(`Échec de l'indexation de la formation ${doc.id} :`, err);
		}
	}

	console.log(`Formations : ${indexed}/${docs.length} réindexée(s).`);
	if (failed.length) {
		console.error(`Formations en échec : ${failed.join(", ")}`);
		process.exitCode = 1;
	}
};

// payload run n'attend pas les promesses en suspens : top-level await requis.
try {
	await run();
} catch (error) {
	console.error("Réindexation des formations échouée :", error);
	process.exitCode = 1;
} finally {
	process.exit();
}
