import type {
	Field,
	FieldHook,
	NumberFieldSingleValidation,
	PayloadRequest,
} from "payload";
import { isAdmin } from "../hooks";

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

const isValidViewCount = (value: unknown): value is number =>
	typeof value === "number" && Number.isInteger(value) && value >= 0;

const validateViewCount: NumberFieldSingleValidation = (value) =>
	value === null ||
	value === undefined ||
	isValidViewCount(value) ||
	"Le nombre de lectures doit être un entier positif ou nul.";

const viewCountContextKey = (guideId: number | string) =>
	`guideViewCount:${guideId}`;

const readGuideViewCount: FieldHook = async ({ req, siblingData, context }) => {
	// Les hooks afterRead s'exécutent avant le contrôle d'accès au champ.
	if (!isAdmin({ req }) || !siblingData?.id) return undefined;
	const key = viewCountContextKey(siblingData.id);
	if (!(key in context)) {
		context[key] = findGuideViews(req, siblingData.id).then(
			(views) => views?.viewCount ?? 0,
		);
	}
	return context[key];
};

export const guideViewCountFields: Field[] = [
	{
		name: "viewCount",
		type: "number",
		virtual: true,
		min: 0,
		label: { fr: "Nombre de lectures" },
		access: { read: isAdmin, create: isAdmin, update: isAdmin },
		validate: validateViewCount,
		admin: {
			readOnly: false,
			position: "sidebar",
			step: 1,
			description:
				"Détermine l'ordre de la section « Fiches pratiques les plus lues » de l'accueil. Augmente de 1 à chaque lecture de la fiche.",
		},
		hooks: {
			afterRead: [readGuideViewCount],
			afterChange: [
				async ({ req, siblingData, originalDoc, value }) => {
					const next = siblingData?.viewCount;
					if (
						!isValidViewCount(next) ||
						!originalDoc?.id ||
						next === siblingData?.viewCountLoaded
					)
						return value;

					const views = await findGuideViews(req, originalDoc.id);
					if (!views) {
						if (next === 0) return next;
						await req.payload.create({
							collection: "practical-guide-views",
							data: { guide: originalDoc.id, viewCount: next },
							req,
						});
					} else if (views.viewCount !== next) {
						await req.payload.update({
							collection: "practical-guide-views",
							id: views.id,
							data: { viewCount: next },
							req,
						});
					}
					return next;
				},
			],
		},
	},
	{
		name: "viewCountLoaded",
		type: "number",
		virtual: true,
		access: { read: isAdmin, create: isAdmin, update: isAdmin },
		admin: {
			hidden: true,
			readOnly: false,
		},
		hooks: {
			afterRead: [readGuideViewCount],
			afterChange: [
				({ siblingData, value }) =>
					typeof siblingData?.viewCount === "number"
						? siblingData.viewCount
						: value,
			],
		},
	},
];
