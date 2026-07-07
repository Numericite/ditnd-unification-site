import {
	FixedToolbarFeature,
	HeadingFeature,
	lexicalEditor,
} from "@payloadcms/richtext-lexical";

// Restricted editor matching the FALC whitelist (h2/h3 headings, lists,
// bold, links). Shared by the `contentSimplified` field of practical guides
// and the simplified content generator global.
export function simplifiedLexicalEditor({
	fixedToolbar = false,
}: {
	fixedToolbar?: boolean;
} = {}) {
	return lexicalEditor({
		features: ({ defaultFeatures }) => [
			...defaultFeatures.filter(
				(feature) =>
					![
						"align",
						"blockquote",
						"checklist",
						"heading",
						"horizontalRule",
						"indent",
						"inlineCode",
						"italic",
						"relationship",
						"strikethrough",
						"subscript",
						"superscript",
						"underline",
						"upload",
					].includes(feature.key),
			),
			HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
			...(fixedToolbar ? [FixedToolbarFeature()] : []),
		],
	});
}
