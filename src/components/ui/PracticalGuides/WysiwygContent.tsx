import { tss } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import { type Link, generateSummaryFromRichText } from "~/utils/tools";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { RichTextRenderer } from "./RichTextRenderer";

export default function WysiwygContent({
	title,
	content,
	setMenuLinks,
}: {
	title: string;
	content: DefaultTypedEditorState;
	setMenuLinks?: Dispatch<SetStateAction<Link[]>>;
}) {
	const { classes, cx } = useStyles();

	useEffect(() => {
		if (!setMenuLinks) return;

		setMenuLinks(generateSummaryFromRichText(content));
	}, [content, setMenuLinks]);

	return (
		<div className={cx(classes.wysiwig)} id="wysiwig-content">
			<h1>{title}</h1>
			<RichTextRenderer content={content} />
		</div>
	);
}

const useStyles = tss.withName(WysiwygContent.name).create(() => ({
	wysiwig: {
		h1: {
			color: fr.colors.decisions.text.active.blueFrance.default,
		},
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
		ul: {
			paddingInlineStart: "2.5rem",
			"li:has(ul)": {
				listStyle: "none",
			},
			ul: {
				li: {
					listStyleType: "circle",
				},
			},
		},
		a: {
			color: fr.colors.decisions.background.actionHigh.blueFrance.default,
		},
		blockquote: {
			padding: "2rem 3rem",
			margin: 0,
			fontSize: "18px",
		},
	},
}));
