import config from "@payload-config";
import { getPayload } from "payload";
import { resetCartography, seedCartography } from "./tasks/cartography";

const run = async () => {
	try {
		const payload = await getPayload({ config });

		await resetCartography(payload);
		await seedCartography(payload);

		console.log("Cartography seeded successfully.");
	} catch (e) {
		console.error(e);
		process.exitCode = 1;
	} finally {
		process.exit();
	}
};

await run();
