import config from "@payload-config";
import { getPayload } from "payload";
import { seedConditions } from "./tasks/conditions";
import { seedTheme } from "./tasks/theme";
import { seedPracticalGuides } from "./tasks/practical-guide";
import { seedCourses } from "./tasks/courses";
import { seedJourneys } from "./tasks/journeys";
import { seedMedia } from "./tasks/medias";
import homeTask from "./tasks/home";
import { seedPersonas } from "./tasks/personas";
import footerTask from "./tasks/footer";

const seedData = async () => {
	try {
		const payload = await getPayload({
			config,
		});

		await payload.create({
			collection: "users",
			data: {
				email: "admin@test.test",
				firstName: "Admin",
				lastName: "Admin",
				password: "12345",
				role: "admin",
			},
		});

		await payload.create({
			collection: "users",
			data: {
				email: "user@test.test",
				firstName: "User",
				lastName: "Test",
				password: "1234",
				role: "editor",
			},
		});
		await homeTask(payload);
		await footerTask(payload);
		await seedTheme(payload);
		await seedMedia(payload);
		await seedConditions(payload);
		await seedPersonas(payload);
		await seedCourses(payload);
		await seedPracticalGuides(payload);
		await seedJourneys(payload);
	} catch (e) {
		console.error(e);
	} finally {
		process.exit();
	}
};

await seedData();
