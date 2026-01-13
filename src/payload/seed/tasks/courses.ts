import type { Payload } from "payload";
import { TRPCError } from "@trpc/server";

const courses = [
	{
		title: "Comprendre l'autisme chez l'enfant",
		description:
			"Les bases pour reconnaître les particularités de l'autisme et mieux comprendre les besoins de son enfant.",
		link: "https://lien-vers-site.com",
		theme: 1,
		persona: 1,
		condition: 1,
	},
	{
		title: "Développement et manifestations selon l'âge",
		description:
			"Comment l'autisme peut apparaître différemment chez un jeu enfant, un adolescent ou un adulte.",
		link: "https://lien-vers-site.com",
		theme: 1,
		persona: 1,
		condition: 1,
	},
	{
		title: "Repérage précoce : signes à observer",
		description:
			"Des repères pour identifier des signaux d'alerte tout en évitant le surdiagnostic.",
		link: "https://lien-vers-site.com",
		theme: 2,
		persona: 1,
		condition: 1,
	},
];

async function createCourses(
	payload: Payload,
	data: {
		title: string;
		link: string;
		theme: number;
		persona: number;
		condition: number;
	},
): Promise<void> {
	try {
		await payload.create({
			collection: "courses",
			data,
			draft: true,
		});
	} catch (error) {
		throw new TRPCError({
			message: `Error creating courses error ${error}`,
			code: "INTERNAL_SERVER_ERROR",
		});
	}
}

export async function seedCourses(payload: Payload) {
	for (const course of courses) {
		await createCourses(payload, course);
	}
}
