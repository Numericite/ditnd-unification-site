import { tss } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { RichTextRenderer } from "./RichTextRenderer";

type Props = {
	content: DefaultTypedEditorState;
};

export default function WysiwygContent({ content }: Props) {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.wysiwig)}>
			<RichTextRenderer content={content} />
		</div>
	);
}

const useStyles = tss.withName(WysiwygContent.name).create(() => ({
	wysiwig: {
		h2: {
			fontSize: "1.75rem",
			lineHeight: "2.25rem",
		},
		h3: {
			fontSize: "1.5rem",
			lineHeight: "2rem",
		},
		h4: {
			fontSize: "1.25rem",
			lineHeight: "1.75rem",
		},
		h5: {
			fontSize: "1rem",
			lineHeight: "1.5rem",
		},
		h6: {
			fontSize: "1rem",
			lineHeight: "1.5rem",
		},
		"ul:not(.fr-quote__source)": {
			paddingInlineStart: "2.5rem",
			marginBottom: "1.5rem",
			"li:has(ul)": {
				listStyle: "none",
			},
			ul: {
				li: {
					listStyleType: "circle",
				},
			},
		},
		".fr-callout": {
			marginBottom: "1.5rem",
		},
		a: {
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
		},
	},
}));
