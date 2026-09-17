import config from "@payload-config";
import { getPayload } from "payload";
import newsletterTask from "./tasks/newsletter";

const run = async () => {
	try {
		const payload = await getPayload({ config });

		const existing = await payload.findGlobal({ slug: "newsletter" });

		if (existing?.title && process.env.SEED_FORCE !== "true") {
			console.log(
				"Newsletter global already has content — aborting to avoid overwriting editorial changes. Re-run with SEED_FORCE=true to overwrite.",
			);
			return;
		}

		await newsletterTask(payload);
		console.log("Newsletter seeded successfully.");
	} catch (e) {
		console.error(e);
		process.exitCode = 1;
	} finally {
		process.exit();
	}
};

await run();
