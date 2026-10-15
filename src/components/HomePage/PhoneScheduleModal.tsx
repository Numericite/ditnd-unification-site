import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";
import type { Home } from "~/payload/payload-types";

const SCHEDULE_DAYS: {
	label: string;
	key: keyof NonNullable<Home["contact"]["phone"]["schedule"]>;
	dayOfWeek: number;
}[] = [
	{ label: "Lundi", key: "lundi", dayOfWeek: 1 },
	{ label: "Mardi", key: "mardi", dayOfWeek: 2 },
	{ label: "Mercredi", key: "mercredi", dayOfWeek: 3 },
	{ label: "Jeudi", key: "jeudi", dayOfWeek: 4 },
	{ label: "Vendredi", key: "vendredi", dayOfWeek: 5 },
	{ label: "Samedi", key: "samedi", dayOfWeek: 6 },
	{ label: "Dimanche", key: "dimanche", dayOfWeek: 0 },
];

type Props = {
	schedule: Home["contact"]["phone"]["schedule"];
	scheduleNote?: string | null;
};

export function PhoneSchedulePanel({ schedule, scheduleNote }: Props) {
	const { classes } = useStyles();
	const todayDayOfWeek = new Date().getDay();

	return (
		<div className={classes.panel}>
			<p className={classes.title}>Horaires de la ligne</p>
			<table className={classes.table}>
				<tbody>
					{SCHEDULE_DAYS.map(({ label, key, dayOfWeek }) => {
						const day = schedule?.[key];
						const isToday = dayOfWeek === todayDayOfWeek;
						return (
							<tr
								key={key}
								className={isToday ? classes.todayRow : classes.row}
							>
								<td className={isToday ? classes.todayCell : classes.cell}>
									{isToday ? `${label} (aujourd'hui)` : label}
								</td>
								<td
									className={
										isToday
											? classes.todayCell
											: day?.closed
												? classes.closedCell
												: classes.cell
									}
									style={{ textAlign: "right" }}
								>
									{day?.closed
										? "Fermé"
										: day?.openTime && day?.closeTime
											? `${day.openTime} – ${day.closeTime}`
											: "–"}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
			{scheduleNote && <p className={classes.note}>{scheduleNote}</p>}
		</div>
	);
}

const useStyles = tss.withName({ PhoneSchedulePanel }).create({
	panel: {
		position: "absolute",
		top: "calc(100% - 32px)",
		left: "50%",
		transform: "translateX(-50%)",
		width: "320px",
		backgroundColor: fr.colors.decisions.background.default.grey.default,
		boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
		padding: `${fr.spacing("3w")} ${fr.spacing("2w")}`,
		zIndex: 100,
	},
	title: {
		fontSize: "1.125rem",
		fontWeight: 700,
		margin: `0 ${fr.spacing("2w")} ${fr.spacing("1w")}`,
	},
	table: {
		width: "100%",
		borderCollapse: "collapse",
		marginBottom: fr.spacing("2w"),
	},
	row: {},
	todayRow: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
	},
	cell: {
		padding: `${fr.spacing("2v")} ${fr.spacing("2w")}`,
		fontSize: "0.9375rem",
	},
	todayCell: {
		padding: `${fr.spacing("2v")} ${fr.spacing("2w")}`,
		fontSize: "0.9375rem",
		color: fr.colors.decisions.text.actionHigh.blueFrance.default,
	},
	closedCell: {
		padding: `${fr.spacing("2v")} ${fr.spacing("2w")}`,
		fontSize: "0.9375rem",
		color: fr.colors.decisions.text.default.error.default,
	},
	note: {
		fontSize: "0.875rem",
		color: fr.colors.decisions.text.mention.grey.default,
		margin: 0,
	},
});
