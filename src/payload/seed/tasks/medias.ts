import type { Payload } from "payload";
import fs from "node:fs";
import path from "node:path";

const medias = [
	{
		alt: "Un amphitheatre remplie d'étudiant d'un établissement universitaire",
		filename: "5f31522af426179fcf0c38a8acdab076dcbba60d.jpg",
		mimeType: "image/jpeg",
	},
	{
		alt: "Un groupe de jeunes étudiants discutant dans une salle de classe",
		filename: "3c912541d5c3d673362a2e37aa16999659d820b3.jpg",
		mimeType: "image/jpeg",
	},
	{
		alt: "Une salle de classe en pleins cours de mathématique",
		filename: "08ab4c500f67e76bcac6b5e17ae43150b4d55dc4.jpg",
		mimeType: "image/jpeg",
	},
	{
		alt: "Des groupes d'enfants souriants jouant ensembles",
		filename: "9e5e9574245d9320041db1b43defcd34305abe82.jpg",
		mimeType: "image/jpeg",
	},
	{
		alt: "Une enfant souriante portant un casque d'écoute",
		filename: "49e0d5c4d3a6626902e5671386df7fc79a220bc1.jpg",
		mimeType: "image/jpeg",
	},
	{
		alt: "Un enfant qui étudie sérieusement dans une salle de classe remplie",
		filename: "908a65f61a48b49ff17c277e6a3580b273bbdd17.jpg",
		mimeType: "image/jpeg",
	},
	{
		alt: "Un parent et son enfant qui ont une bonne relation à table",
		filename: "d4a89268a1c8034d3761137468636e7ac2add30b.jpg",
		mimeType: "image/jpeg",
	},
];

async function createMedia(
	payload: Payload,
	data: {
		alt: string;
		filename: string;
	},
): Promise<void> {
	try {
		const filePath = path.resolve(process.cwd(), "public/seed", data.filename);

		const fileBuffer = fs.readFileSync(filePath);

		await payload.create({
			collection: "medias",
			data: {
				alt: data.alt,
			},
			file: {
				data: fileBuffer,
				mimetype: "image/jpeg",
				name: data.filename,
				size: fileBuffer.length,
			},
			draft: true,
		});
	} catch (error) {
		throw new Error(`Error creating media: ${error}`);
	}
}

export async function seedMedia(payload: Payload) {
	for (const media of medias) {
		await createMedia(payload, media);
	}
}
