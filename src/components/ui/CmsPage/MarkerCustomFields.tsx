import Link from "next/link";
import type { CustomFieldDef } from "~/server/api/routers/maps";
import { toMapLinkValue } from "~/utils/map-link-field";

type Props = {
	fields: CustomFieldDef[] | null | undefined;
	metadata: Record<string, unknown> | null;
	markerName: string;
	lineClassName: string;
	labelClassName: string;
	linkClassName: string;
};

/**
 * Affiche les champs personnalisés d'un marqueur (popup et vue liste).
 */
export default function MarkerCustomFields({
	fields,
	metadata,
	markerName,
	lineClassName,
	labelClassName,
	linkClassName,
}: Props) {
	if (!fields || fields.length === 0) return null;

	return fields.map((f) => {
		const raw = metadata?.[f.key];
		if (raw === undefined || raw === null) return null;

		if (f.type === "link") {
			const link = toMapLinkValue(raw);
			if (!link) return null;
			const text = link.label || f.label;
			return (
				<p key={f.key} className={lineClassName}>
					<Link
						href={link.url}
						target="_blank"
						rel="noopener noreferrer"
						className={linkClassName}
						title={`${text} : ${markerName}, nouvelle fenêtre`}
					>
						{text}
					</Link>
				</p>
			);
		}

		// Valeur d'un autre type (ex : ancien lien)
		if (typeof raw === "object") return null;

		let display: string;
		if (f.type === "checkbox") {
			display = raw ? "Oui" : "Non";
		} else if (f.type === "select") {
			const opt = f.options?.find((o) => o.value === String(raw));
			display = opt ? opt.label : String(raw);
		} else {
			display = String(raw);
		}
		return (
			<p key={f.key} className={lineClassName}>
				<span className={labelClassName}>{f.label} :</span> {display}
			</p>
		);
	});
}
