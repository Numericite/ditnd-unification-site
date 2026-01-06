import type { Payload } from "payload";
import { TRPCError } from "@trpc/server";

const personas = [
	{
		name: "Parent ou proche",
		description: "Description d'un parent ou d'un proche",
		slug: "pp",
	},
	{
		name: "Personne",
		description: "Description d'une personne concernée",
		slug: "pe",
	},
	{
		name: "Professionnel dans le médico-social",
		description: "Description des Professionnels dans le médico-social",
		slug: "pro-m",
	},
	{
		name: "Professionnel dans l'éducation",
		description: "Description des Professionnels dans l'éducation",
		slug: "pro-e",
	},
	{
		name: "Professionnel employant des personnes TND",
		description: "Description des Professionnels employant des personnes TND",
		slug: "pro-a-tnd",
	},
	{
		name: "Professionnel accueillant des personnes TND",
		description: "Description des Professionnels accueillant des personnes TND",
		slug: "pro-e-tnd",
	},
	{
		name: "Grand public",
		description: "Description du grand public",
		slug: "gp",
	},
];

async function createPersonas(
	payload: Payload,
	data: { name: string; description: string; slug: string },
): Promise<void> {
	try {
		await payload.create({
			collection: "personas",
			data,
		});
	} catch (error) {
		throw new TRPCError({
			message: `Error creating persona ${data.name} with error ${error}`,
			code: "INTERNAL_SERVER_ERROR",
		});
	}
}

export async function seedPersonas(payload: Payload) {
	for (const persona of personas) {
		await createPersonas(payload, persona);
	}
}
