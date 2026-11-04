import type {
	Field,
	FieldHook,
	NumberFieldSingleValidation,
	PayloadRequest,
} from "payload";
import { isAdmin } from "../hooks";

const findGuideViews = async (req: PayloadRequest, guideId: number) => {
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

const viewCountContextKey = (guideId: number) => `guideViewCount:${guideId}`;

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

const adminOnly = { read: isAdmin, create: isAdmin, update: isAdmin };

export const guideViewCountFields: Field[] = [
	{
		name: "viewCount",
		type: "number",
		virtual: true,
		min: 0,
		label: { fr: "Nombre de lectures" },
		access: adminOnly,
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
					const submittedCount = siblingData?.viewCount;
					if (
						!isValidViewCount(submittedCount) ||
						!originalDoc?.id ||
						submittedCount === siblingData?.viewCountSnapshot
					)
						return value;

					const views = await findGuideViews(req, originalDoc.id);
					if (!views) {
						if (submittedCount === 0) return submittedCount;
						await req.payload.create({
							collection: "practical-guide-views",
							data: { guide: originalDoc.id, viewCount: submittedCount },
							req,
						});
					} else if (views.viewCount !== submittedCount) {
						await req.payload.update({
							collection: "practical-guide-views",
							id: views.id,
							data: { viewCount: submittedCount },
							req,
						});
					}
					return submittedCount;
				},
			],
		},
	},
	/**
	 * Valeur du compteur au chargement du formulaire, cachée à l'admin.
	 * `viewCount` n'est écrit que s'il en diffère : sans cela, chaque sauvegarde
	 * de la fiche écraserait les lectures arrivées pendant l'édition.
	 * Son `afterChange` renvoie la valeur saisie : après chaque sauvegarde, la
	 * comparaison repart de ce que l'admin voit dans le formulaire.
	 */
	{
		name: "viewCountSnapshot",
		type: "number",
		virtual: true,
		access: adminOnly,
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
