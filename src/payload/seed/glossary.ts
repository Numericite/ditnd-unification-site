import config from "@payload-config";
import { getPayload } from "payload";
import { seedGlossary } from "./tasks/glossary";

const run = async () => {
	try {
		const payload = await getPayload({ config });

		const existing = await payload.find({
			collection: "glossary",
			limit: 1,
		});

		if (existing.totalDocs > 0) {
			console.log(
				`Glossary already contains ${existing.totalDocs} entries — deleting before reseeding.`,
			);
			await payload.delete({
				collection: "glossary",
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
