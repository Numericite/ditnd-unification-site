import config from "@payload-config";
import { getPayload } from "payload";
import menuTask from "./tasks/menu";

/**
 * Pré-remplit le global « menu » avec les liens qui étaient codés en dur dans
 * la navbar (Annuaire, À propos), pour qu'elle reste identique au déploiement.
 *
 * Idempotent : ne fait rien si le menu contient déjà des éléments, pour ne
 * jamais écraser les modifications faites dans l'admin.
 *
 * Usage : yarn seed:menu (après payload migrate)
 */

const run = async () => {
	const payload = await getPayload({ config });
	const menu = await payload.findGlobal({ slug: "menu", depth: 0 });

	if (menu.items?.length) {
		console.log(
			`Menu : ${menu.items.length} élément(s) déjà présent(s), rien à faire.`,
		);
		return;
	}

	await menuTask(payload);
	console.log("Menu : éléments par défaut créés (Annuaire, À propos).");
};

// payload run n'attend pas les promesses en suspens : top-level await requis.
try {
	await run();
} catch (error) {
	console.error("Seed du menu échoué :", error);
	process.exitCode = 1;
} finally {
	process.exit();
}
