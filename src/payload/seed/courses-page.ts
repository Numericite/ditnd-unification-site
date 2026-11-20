import config from "@payload-config";
import { getPayload } from "payload";
import coursesPageTask from "./tasks/courses-page";
import { coursesPageMedias, createMedia } from "./tasks/medias";

const run = async () => {
	const payload = await getPayload({ config });
	const existing = await payload.findGlobal({
		slug: "courses-page",
		depth: 0,
	});

	if (existing.platforms?.title) {
		console.log("Page Me former : contenu déjà présent, rien à faire.");
		return;
	}

	const featured = await createMedia(payload, coursesPageMedias.featured);
	const left = await createMedia(payload, coursesPageMedias.left);
	const header = await createMedia(payload, coursesPageMedias.header);
	await coursesPageTask(payload, { featured, left, header });
	console.log("Page Me former : contenu par défaut créé.");
};

try {
	await run();
} catch (error) {
	console.error("Seed de la page Se former échoué :", error);
	process.exitCode = 1;
} finally {
	process.exit();
}
