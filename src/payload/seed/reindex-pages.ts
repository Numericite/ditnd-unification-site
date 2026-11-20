import config from "@payload-config";
import { getPayload } from "payload";
import { indexPageSearchVector } from "../collections/Pages";

/**
 * Calcule les vecteurs de recherche sémantique de toutes les pages publiées
 * (table pages_search_vectors).
 *
 * Le hook afterChange n'indexe une page qu'à son enregistrement : les pages
 * publiées avant l'ajout de la table ne sont donc pas indexées. À lancer une
 * fois après `payload migrate`. Idempotent : chaque vecteur est remplacé.
 *
 * Usage : yarn reindex:pages
 */

const run = async () => {
	const payload = await getPayload({ config });

	const { docs } = await payload.find({
		collection: "pages",
		where: { _status: { equals: "published" } },
		depth: 1,
		draft: false,
		pagination: false,
		overrideAccess: true,
	});

	let indexed = 0;
	const failed: number[] = [];
	// Séquentiel : chaque page appelle l'API d'embeddings.
	for (const doc of docs) {
		try {
			await indexPageSearchVector(payload, doc);
			indexed++;
		} catch (err) {
			failed.push(doc.id);
			console.error(`Échec de l'indexation de la page ${doc.id} :`, err);
		}
	}

	console.log(`Pages : ${indexed}/${docs.length} indexée(s).`);
	if (failed.length) {
		console.error(`Pages en échec : ${failed.join(", ")}`);
		process.exitCode = 1;
	}
};

// payload run n'attend pas les promesses en suspens : top-level await requis.
try {
	await run();
} catch (error) {
	console.error("Indexation des pages échouée :", error);
	process.exitCode = 1;
} finally {
	process.exit();
}
