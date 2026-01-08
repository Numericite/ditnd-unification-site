import sanitizeHtml from "sanitize-html";
import { tss } from "tss-react";
import { fr } from "@codegouvfr/react-dsfr";
import { addAnchors } from "~/utils/tools";

export default function WysiwygContent({ html }: { html: string }) {
	const { classes, cx } = useStyles();

	return (
		<div
			className={cx(classes.wysiwig)}
			dangerouslySetInnerHTML={{
				__html: addAnchors(sanitizeHtml(html)),
			}}
		/>
	);
}

const useStyles = tss.withName(WysiwygContent.name).create(() => ({
	wysiwig: {
		"h1,h2,h3": {
			color: fr.colors.decisions.text.active.blueFrance.default,
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
