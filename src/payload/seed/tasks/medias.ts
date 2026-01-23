import { TRPCError } from "@trpc/server";
import type { Payload } from "payload";

const medias = [{}];

async function createMedia(payload: Payload, data: {}): Promise<void> {
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

export async function seedCMedia(payload: Payload) {
	for (const media of medias) {
		await createMedia(payload, media);
	}
}
