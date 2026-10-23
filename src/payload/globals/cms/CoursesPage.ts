import type {
	Field,
	GlobalConfig,
	Tab,
	TextFieldSingleValidation,
} from "payload";
import { text } from "payload/shared";
import { hideForNonAdmin, isAdmin } from "~/payload/hooks";
import { standardFields } from "~/payload/fields/standards";
import { validateHttpOrInternalUrl } from "~/payload/fields/validateHttpUrl";

// Pour un lien facultatif, le texte et l'URL vont ensemble : un seul des deux
// renseigné masquerait le lien côté public sans prévenir l'éditeur.
const missingWithSibling =
	(sibling: "label" | "url", message: string): TextFieldSingleValidation =>
	(value, { siblingData }) =>
		!value && (siblingData as Record<string, unknown>)?.[sibling]
			? message
			: true;

const linkField = ({
	label,
	required,
	description,
}: {
	label: string;
	required: boolean;
	description?: string;
}): Field => {
	const validateLabel: TextFieldSingleValidation = (value, options) => {
		const result = required
			? true
			: missingWithSibling("url", "Renseignez aussi le texte du lien.")(
					value,
					options,
				);
		return result === true ? text(value, options) : result;
	};

	const validateUrl: TextFieldSingleValidation = (value, options) => {
		const result = required
			? true
			: missingWithSibling("label", "Renseignez aussi l'URL du lien.")(
					value,
					options,
				);
		return result === true ? validateHttpOrInternalUrl(value, options) : result;
	};

	return {
		name: "link",
		type: "group",
		label: { fr: label },
		admin: { description },
		fields: [
			{
				type: "row",
				fields: [
					{
						name: "label",
						type: "text",
						label: { fr: "Texte du lien" },
						required,
						validate: validateLabel,
						admin: { width: "50%" },
					},
					{
						name: "url",
						type: "text",
						label: { fr: "URL" },
						required,
						validate: validateUrl,
						admin: {
							width: "50%",
							description:
								"Lien interne (ex : /formations) ou externe (ex : https://...)",
						},
					},
				],
			},
		],
	};
};

const platformTab = ({
	name,
	label,
	description,
}: {
	name: string;
	label: string;
	description: string;
}): Tab => ({
	name,
	label: { fr: label },
	description,
	fields: [
		{
			name: "badge",
			type: "text",
			label: { fr: "Badge" },
			admin: {
				description: "Nom de l'organisme (ex : Campus du GNCRA)",
			},
		},
		standardFields.title,
		standardFields.longDescription,
		{
			...standardFields.image,
			required: false,
			admin: {
				description:
					"Facultative : une illustration par défaut est affichée en son absence",
			},
		},
		linkField({ label: "Lien", required: true }),
	],
});

export const CMSCoursesPage: GlobalConfig = {
	slug: "courses-page",
	label: "Formations",
	admin: {
		group: { fr: "Pages" },
		hidden: hideForNonAdmin,
	},
	access: {
		read: isAdmin,
		update: isAdmin,
	},
	fields: [
		{
			type: "tabs",
			tabs: [
				{
					label: "Plateformes de formation",
					name: "platforms",
					fields: [
						standardFields.title,
						standardFields.longDescription,
						{
							type: "tabs",
							tabs: [
								platformTab({
									name: "featured",
									label: "Mise en avant",
									description: "Carte affichée en pleine largeur.",
								}),
								platformTab({
									name: "left",
									label: "Plateforme 2",
									description: "Carte affichée sur la moitié gauche.",
								}),
								platformTab({
									name: "right",
									label: "Plateforme 3",
									description: "Carte affichée sur la moitié droite.",
								}),
							],
						},
					],
				},
				{
					label: "Sélection des formations",
					name: "selection",
					fields: [
						standardFields.title,
						standardFields.longDescription,
						{
							name: "steps",
							type: "array",
							label: { fr: "Étapes" },
							labels: {
								singular: { fr: "Étape" },
								plural: { fr: "Étapes" },
							},
							minRows: 1,
							maxRows: 3,
							required: true,
							admin: {
								description:
									"Les étapes sont numérotées automatiquement dans l'ordre de la liste.",
								components: {
									RowLabel: "../payload/components/ArrayRowLabel",
								},
							},
							fields: [standardFields.title, standardFields.longDescription],
						},
						linkField({
							label: "Bouton",
							required: false,
							description:
								"Facultatif : le bouton n'est affiché que si le texte et l'URL sont renseignés.",
						}),
					],
				},
			],
		},
	],
};
