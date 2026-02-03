import sanitizeHtml from "sanitize-html";
import { tss } from "tss-react";
import { fr } from "@codegouvfr/react-dsfr";
import { addAnchors } from "~/utils/tools";

export default function WysiwygContent({
	title,
	html,
}: {
	title: string;
	html: string;
}) {
	const { classes, cx } = useStyles();

	return (
		<div className={cx(classes.wysiwig)} id="pg-content">
			<h1>{title}</h1>
			<div
				dangerouslySetInnerHTML={{
					__html: addAnchors(sanitizeHtml(html)),
				}}
			/>
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
			color: fr.colors.decisions.background.actionHigh.blueFrance.hover,
		},
	},
}));
