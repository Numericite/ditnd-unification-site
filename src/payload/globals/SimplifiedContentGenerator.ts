import type { GlobalConfig } from "payload";
import { simplifiedLexicalEditor } from "../fields/simplifiedWysiwyg";

// Schema-only global: it is never saved. It exists so the simplified content
// generator view can render real Payload richText fields through the
// form-state pipeline (buildFormState requires a schema path that lives in
// the config).
export const SimplifiedContentGenerator: GlobalConfig = {
	slug: "simplified-content-generator",
	label: { fr: "Générateur de contenu simplifié" },
	admin: {
		hidden: true,
	},
	fields: [
		{
			name: "source",
			type: "richText",
			label: { fr: "Contenu d'origine" },
			editor: simplifiedLexicalEditor({ fixedToolbar: true }),
		},
		{
			name: "result",
			type: "richText",
			label: { fr: "Contenu simplifié" },
			editor: simplifiedLexicalEditor({ fixedToolbar: true }),
		},
	],
};
