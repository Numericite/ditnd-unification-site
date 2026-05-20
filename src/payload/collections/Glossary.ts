import type { CollectionConfig } from "payload";

export const Glossary: CollectionConfig = {
	slug: "glossary",
	admin: {
		useAsTitle: "name",
		group: { fr: "Glossaire" },
		defaultColumns: ["name", "category", "description", "link"],
	},
	labels: {
		singular: "Terme du glossaire",
		plural: "Glossaire",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: { fr: "Nom" },
		},
		{
			name: "description",
			type: "textarea",
			required: true,
			label: { fr: "Description" },
		},
		{
			name: "category",
			type: "relationship",
			relationTo: "glossary-categories",
			required: false,
			label: { fr: "Catégorie" },
			admin: {
				position: "sidebar",
			},
		},
		{
			name: "link",
			type: "text",
			required: false,
			label: { fr: "Lien vers une source externe" },
			admin: {
				description:
					"Lien optionnel vers une source externe (doit commencer par https://)",
			},
			validate: (value: unknown) => {
				if (value === undefined || value === null || value === "") return true;
				if (typeof value !== "string")
					return "Le lien doit être une chaîne de caractères.";
				try {
					const url = new URL(value);
					if (url.protocol !== "https:" && url.protocol !== "http:") {
						return "Le lien doit commencer par http:// ou https://";
					}
				} catch {
					return "Le lien n'est pas une URL valide.";
				}
				return true;
			},
		},
	],
};
