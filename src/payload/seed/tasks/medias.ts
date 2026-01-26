import { TRPCError } from "@trpc/server";
import type { Payload } from "payload";

const medias = [
	{
		alt: "Un amphitheatre remplie d'étudiant d'un établissement universitaire",
		url: "/api/medias/file/5f31522af426179fcf0c38a8acdab076dcbba60d.jpg",
		filename: "5f31522af426179fcf0c38a8acdab076dcbba60d.jpg",
		mimeType: "image/jpeg",
	},
	{
		alt: "Un groupe de jeunes étudiants discutant dans une salle de classe",
		url: "/api/medias/file/3c912541d5c3d673362a2e37aa16999659d820b3.jpg",
		filename: "3c912541d5c3d673362a2e37aa16999659d820b3.jpg",
		mimeType: "image/jpeg",
	},
	{
		alt: "Une salle de classe en pleins cours de mathématique",
		url: "/api/medias/file/08ab4c500f67e76bcac6b5e17ae43150b4d55dc4.jpg",
		filename: "08ab4c500f67e76bcac6b5e17ae43150b4d55dc4.jpg",
		mimeType: "image/jpeg",
	},
	{
		alt: "Des groupes d'enfants souriants jouant ensembles",
		url: "/api/medias/file/9e5e9574245d9320041db1b43defcd34305abe82.jpg",
		filename: "9e5e9574245d9320041db1b43defcd34305abe82.jpg",
		mimeType: "image/jpeg",
	},
	{
		alt: "Une enfant souriante portant un casque d'écoute",
		url: "/api/medias/file/49e0d5c4d3a6626902e5671386df7fc79a220bc1.jpg",
		filename: "49e0d5c4d3a6626902e5671386df7fc79a220bc1.jpg",
		mimeType: "image/jpeg",
	},
	{
		alt: "Un enfant qui étudie sérieusement dans une salle de classe remplie",
		url: "/api/medias/file/908a65f61a48b49ff17c277e6a3580b273bbdd17.jpg",
		filename: "908a65f61a48b49ff17c277e6a3580b273bbdd17.jpg",
		mimeType: "image/jpeg",
	},
	{
		alt: "Un parent et son enfant qui ont une bonne relation à table",
		url: "/api/medias/file/d4a89268a1c8034d3761137468636e7ac2add30b.jpg",
		filename: "d4a89268a1c8034d3761137468636e7ac2add30b.jpg",
		mimeType: "image/jpeg",
	},
];

async function createMedia(
	payload: Payload,
	data: {
		alt: string;
		url: string;
		filename: string;
		mimeType: string;
	},
): Promise<void> {
	try {
		await payload.create({
			collection: "medias",
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

export async function seedMedia(payload: Payload) {
	for (const media of medias) {
		await createMedia(payload, media);
	}
}
