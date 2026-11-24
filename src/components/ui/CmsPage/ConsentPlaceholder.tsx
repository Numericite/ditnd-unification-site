import { fr } from "@codegouvfr/react-dsfr";
import type { CSSProperties } from "react";

type Props = {
	title: string;
	description: string;
	grantLabel: string;
	onGranted: () => void;
	className?: string;
	style?: CSSProperties;
};

export default function ConsentPlaceholder({
	title,
	description,
	grantLabel,
	onGranted,
	className,
	style,
}: Props) {
	return (
		<div
			className={`${fr.cx("fr-consent-placeholder")}${className ? ` ${className}` : ""}`}
			style={style}
		>
			<span className={fr.cx("fr-h6", "fr-mb-2v")}>{title}</span>
			<p className={fr.cx("fr-mb-6v")}>{description}</p>
			<button type="button" className={fr.cx("fr-btn")} onClick={onGranted}>
				Autoriser
				<span className={fr.cx("fr-sr-only")}> {grantLabel}</span>
			</button>
		</div>
	);
}
