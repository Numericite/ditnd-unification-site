import config from "@payload-config";
import { getPayload } from "payload";
import { seedGlossary } from "./tasks/glossary";

const run = async () => {
	try {
		const payload = await getPayload({ config });

		const existingTerms = await payload.find({
			collection: "glossary",
			limit: 1,
		});

		if (existingTerms.totalDocs > 0) {
			console.log(
				`Glossary already contains ${existingTerms.totalDocs} entries — deleting before reseeding.`,
			);
			await payload.delete({
				collection: "glossary",
				where: { id: { exists: true } },
			});
		}

		const existingCategories = await payload.find({
			collection: "glossary-categories",
			limit: 1,
		});

		if (existingCategories.totalDocs > 0) {
			console.log(
				`Glossary categories already contain ${existingCategories.totalDocs} entries — deleting before reseeding.`,
			);
			await payload.delete({
				collection: "glossary-categories",
				where: { id: { exists: true } },
			});
		}

		await seedGlossary(payload);
		console.log("Glossary seeded successfully.");
	} catch (e) {
		console.error(e);
		process.exitCode = 1;
	} finally {
		process.exit();
	}
};

await run();
