import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";

type Props = {
	counts: Record<string, number>;
	total: number;
	getColor: (categoryId: number) => string;
	getLabel: (categoryId: number) => string;
	onClick: () => void;
};

function outerRadius(total: number): number {
	if (total < 10) return 16;
	if (total < 50) return 20;
	if (total < 200) return 26;
	return 32;
}

// Trace un secteur d'anneau (donut) entre deux fractions du tour complet.
function donutSegment(
	start: number,
	end: number,
	r: number,
	r0: number,
): string {
	if (end - start === 1) end -= 0.00001;
	const a0 = 2 * Math.PI * (start - 0.25);
	const a1 = 2 * Math.PI * (end - 0.25);
	const x0 = Math.cos(a0);
	const y0 = Math.sin(a0);
	const x1 = Math.cos(a1);
	const y1 = Math.sin(a1);
	const largeArc = end - start > 0.5 ? 1 : 0;
	return [
		"M",
		r + r0 * x0,
		r + r0 * y0,
		"L",
		r + r * x0,
		r + r * y0,
		"A",
		r,
		r,
		0,
		largeArc,
		1,
		r + r * x1,
		r + r * y1,
		"L",
		r + r0 * x1,
		r + r0 * y1,
		"A",
		r0,
		r0,
		0,
		largeArc,
		0,
		r + r0 * x0,
		r + r0 * y0,
	].join(" ");
}

export default function MapClusterMarker({
	counts,
	total,
	getColor,
	getLabel,
	onClick,
}: Props) {
	const { classes } = useStyles();
	const r = outerRadius(total);
	const w = r * 2;
	const ring = Math.max(4, r * 0.32);
	const r0 = r - ring;

	const segments = Object.entries(counts)
		.map(([id, count]) => ({ categoryId: Number(id), count }))
		.filter((s) => s.count > 0)
		.sort((a, b) => b.count - a.count);

	const ariaParts = segments
		.map((s) => `${s.count} ${getLabel(s.categoryId)}`)
		.join(", ");

	let cursor = 0;

	return (
		<button
			type="button"
			className={classes.cluster}
			onClick={onClick}
			aria-label={`Groupe de ${total} marqueurs (${ariaParts}). Cliquer pour zoomer.`}
			style={{ width: w, height: w }}
		>
			<svg
				width={w}
				height={w}
				viewBox={`0 0 ${w} ${w}`}
				aria-hidden="true"
				focusable="false"
			>
				<title>{`${total} marqueurs`}</title>
				{segments.map((s) => {
					const start = cursor / total;
					cursor += s.count;
					const end = cursor / total;
					return (
						<path
							key={s.categoryId}
							d={donutSegment(start, end, r, r0)}
							fill={getColor(s.categoryId)}
						/>
					);
				})}
				<circle cx={r} cy={r} r={r0} className={classes.hole} />
				<text
					x={r}
					y={r}
					className={classes.count}
					textAnchor="middle"
					dominantBaseline="central"
					style={{ fontSize: r * 0.7 }}
				>
					{total}
				</text>
			</svg>
		</button>
	);
}

const useStyles = tss.withName(MapClusterMarker.name).create(() => ({
	cluster: {
		display: "block",
		padding: 0,
		border: "none",
		backgroundColor: "transparent !important",
		backgroundImage: "none",
		cursor: "pointer",
		filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))",
		transition: "transform 0.15s ease",
		"&:hover, &:active": {
			transform: "scale(1.08)",
		},
		"&:focus-visible": {
			outline: `2px solid ${fr.colors.decisions.border.plain.info.default}`,
			outlineOffset: "2px",
			borderRadius: "50%",
		},
	},
	hole: {
		fill: fr.colors.decisions.background.default.grey.default,
	},
	count: {
		fontWeight: 700,
		fill: fr.colors.decisions.text.title.grey.default,
		fontFamily: "inherit",
	},
}));
