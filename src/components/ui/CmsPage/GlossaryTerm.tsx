import { fr } from "@codegouvfr/react-dsfr";
import { type ReactNode, useId } from "react";
import { tss } from "tss-react/dsfr";

type Props = {
	description: string;
	children: ReactNode;
};

export default function GlossaryTerm({ description, children }: Props) {
	const { classes, cx } = useStyles();
	const id = `fr-tooltip-glossary-${useId().replace(/:/g, "")}`;

	return (
		<>
			{/* fr-btn--tooltip makes the DSFR script open the tooltip on click
			    only (no hover); its button look is reset to an inline link. */}
			<button
				className={cx(fr.cx("fr-btn--tooltip"), classes.term)}
				aria-describedby={id}
				id={`tooltip-owner-${id}`}
				type="button"
			>
				{children}
			</button>
			<span
				className={fr.cx("fr-tooltip", "fr-placement")}
				id={id}
				role="tooltip"
			>
				{description}
			</span>
		</>
	);
}

const useStyles = tss.withName("GlossaryTerm").create(() => ({
	term: {
		"&&&": {
			all: "unset",
			cursor: "pointer",
			color: "var(--text-action-high-blue-france)",
			backgroundImage: "var(--underline-img), var(--underline-img)",
			backgroundPosition:
				"var(--underline-x) 100%, var(--underline-x) calc(100% - var(--underline-thickness))",
			backgroundRepeat: "no-repeat, no-repeat",
			backgroundSize:
				"var(--underline-hover-width) calc(var(--underline-thickness) * 2), var(--underline-idle-width) var(--underline-thickness)",
		},
		"&&&:hover": {
			"--underline-hover-width": "var(--underline-max-width)",
		},
		"&&&:focus-visible": {
			outline: "2px solid var(--focus)",
			outlineOffset: "2px",
		},
		"&&&::before": {
			content: "none",
		},
	},
}));
