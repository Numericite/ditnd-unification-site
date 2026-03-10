import type { Block } from "payload";

export const CalloutBlock: Block = {
	slug: "callout",
	labels: {
		singular: "Mise en avant",
		plural: "Mises en avant",
	},
	fields: [
		{
			name: "title",
			label: { fr: "Titre" },
			type: "text",
			required: true,
			validate: (val: string | undefined | null) => {
				if (!val)
					return "Le titre de la mise en avant est obligatoire";
				return true;
			},
		},
		{
			name: "content",
			label: { fr: "Contenu" },
			type: "textarea",
			required: true,
			validate: (val: string | undefined | null) => {
				if (!val)
					return "Le contenu de la mise en avant est obligatoire";
				return true;
			},
		},
		{
			name: "image",
			label: { fr: "Image (optionnel)" },
			type: "upload",
			relationTo: "medias",
			required: false,
		},
	],
};
