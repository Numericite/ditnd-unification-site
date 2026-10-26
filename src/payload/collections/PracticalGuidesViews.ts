import type { CollectionConfig, Field, PayloadRequest } from "payload";
import { isAdmin } from "../hooks";

export const PracticalGuideViews: CollectionConfig = {
	slug: "practical-guide-views",
	admin: {
		hidden: true,
	},
	access: {
		read: () => true,
		create: () => true,
		update: () => true,
	},
	fields: [
		{
			name: "guide",
			type: "relationship",
			relationTo: "practical-guides",
			required: true,
			unique: true,
		},
		{
			name: "viewCount",
			type: "number",
			defaultValue: 0,
			required: true,
		},
	],
};

const findGuideViews = async (
	req: PayloadRequest,
	guideId: number | string,
) => {
	const { docs } = await req.payload.find({
		collection: "practical-guide-views",
		where: { guide: { equals: guideId } },
		limit: 1,
		depth: 0,
		req,
	});
	return docs[0];
};

export const guideViewCountField: Field = {
	name: "viewCount",
	type: "number",
	virtual: true,
	min: 0,
	label: { fr: "Nombre de lectures" },
	access: { read: isAdmin, create: isAdmin, update: isAdmin },
	validate: (value: unknown) =>
		value === null ||
		value === undefined ||
		(Number.isInteger(value) && (value as number) >= 0) ||
		"Le nombre de lectures doit être un entier positif ou nul.",
	admin: {
		readOnly: false,
		position: "sidebar",
		step: 1,
		description:
			"Détermine l'ordre de la section « Fiches pratiques les plus lues » de l'accueil. Augmente de 1 à chaque lecture de la fiche. Pris en compte au clic sur « Publier les modifications », pas lors de l'enregistrement automatique.",
	},
	hooks: {
		afterRead: [
			async ({ req, siblingData }) => {
				if (!isAdmin({ req }) || !siblingData?.id) return undefined;
				const views = await findGuideViews(req, siblingData.id);
				return views?.viewCount ?? 0;
			},
		],
		afterChange: [
			async ({ req, siblingData, originalDoc, value }) => {
				const next = siblingData?.viewCount;
				const autosave = req.query?.autosave;
				if (
					typeof next !== "number" ||
					!originalDoc?.id ||
					autosave === true ||
					autosave === "true"
				)
					return value;

				const count = Math.max(0, Math.round(next));
				const views = await findGuideViews(req, originalDoc.id);
				if (!views) {
					if (count === 0) return count;
					await req.payload.create({
						collection: "practical-guide-views",
						data: { guide: originalDoc.id, viewCount: count },
						req,
					});
				} else if (views.viewCount !== count) {
					await req.payload.update({
						collection: "practical-guide-views",
						id: views.id,
						data: { viewCount: count },
						req,
					});
				}
				return count;
			},
		],
	},
};
