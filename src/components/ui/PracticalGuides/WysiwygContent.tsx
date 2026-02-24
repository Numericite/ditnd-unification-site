import { tss } from "tss-react/dsfr";
import { fr } from "@codegouvfr/react-dsfr";
import moment from "moment";
import { type Link, generateSummaryFromRichText } from "~/utils/tools";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { useEffect, type Dispatch, type SetStateAction } from "react";
import { RichTextRenderer } from "./RichTextRenderer";

type Props = {
	title: string;
	content: DefaultTypedEditorState;
	setMenuLinks?: Dispatch<SetStateAction<Link[]>>;
	createdAt: string;
	updatedAt: string;
};

export default function WysiwygContent({
	title,
	content,
	setMenuLinks,
	createdAt,
	updatedAt,
}: Props) {
	const { classes, cx } = useStyles();

	useEffect(() => {
		if (!setMenuLinks) return;

		setMenuLinks(generateSummaryFromRichText(content));
	}, [content, setMenuLinks]);

	const createdAtFormatted = moment(createdAt).format("DD/MM/YYYY");

	const updatedAtFormatted = moment(updatedAt).format("DD/MM/YYYY");

	return (
		<div className={cx(classes.wysiwig)} id="wysiwig-content">
			<h1 className={classes.wysiwygTitle}>{title}</h1>
			<p
				className={fr.cx("fr-text--sm")}
			>{`Publié le ${createdAtFormatted} - Modifié le ${updatedAtFormatted}`}</p>
			<RichTextRenderer content={content} />
		</div>
	);
}

const useStyles = tss.withName(WysiwygContent.name).create(() => ({
	wysiwygTitle: {
		marginBottom: fr.spacing("2v"),
	},
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
