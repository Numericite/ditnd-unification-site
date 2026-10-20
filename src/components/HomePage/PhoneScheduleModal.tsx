import { forwardRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";
import type { Home } from "~/payload/payload-types";
import { type DayOfWeek, formatTime, getParisNow } from "~/utils/scheduleTime";

type Schedule = Home["contact"]["phone"]["schedule"];

const SCHEDULE_DAYS: ReadonlyArray<{
	label: string;
	key: keyof NonNullable<Schedule>;
	dayOfWeek: DayOfWeek;
}> = [
	{ label: "Lundi", key: "lundi", dayOfWeek: 1 },
	{ label: "Mardi", key: "mardi", dayOfWeek: 2 },
	{ label: "Mercredi", key: "mercredi", dayOfWeek: 3 },
	{ label: "Jeudi", key: "jeudi", dayOfWeek: 4 },
	{ label: "Vendredi", key: "vendredi", dayOfWeek: 5 },
	{ label: "Samedi", key: "samedi", dayOfWeek: 6 },
	{ label: "Dimanche", key: "dimanche", dayOfWeek: 0 },
];

const TITLE_ID = "phone-schedule-title";

type Props = {
	schedule: Schedule;
	scheduleNote?: string | null;
};

export const PhoneSchedulePanel = forwardRef<HTMLElement, Props>(
	function PhoneSchedulePanel({ schedule, scheduleNote }, ref) {
		const { classes, cx } = useStyles();
		const todayDayOfWeek = getParisNow().dayOfWeek;

		return (
			<section
				ref={ref}
				id="phone-schedule-panel"
				aria-labelledby={TITLE_ID}
				tabIndex={-1}
				className={classes.panel}
			>
				<p id={TITLE_ID} className={classes.title}>
					Horaires de la ligne
				</p>
				<table className={classes.table} aria-labelledby={TITLE_ID}>
					<thead className={classes.visuallyHidden}>
						<tr>
							<th scope="col">Jour</th>
							<th scope="col">Horaires</th>
						</tr>
					</thead>
					<tbody>
						{SCHEDULE_DAYS.map(({ label, key, dayOfWeek }) => {
							const day = schedule?.[key];
							const isToday = dayOfWeek === todayDayOfWeek;
							const baseCell = isToday ? classes.todayCell : classes.cell;
							const hoursCell = isToday
								? classes.todayCell
								: day?.closed
									? classes.closedCell
									: classes.cell;
							return (
								<tr
									key={key}
									className={isToday ? classes.todayRow : classes.row}
								>
									<th scope="row" className={cx(baseCell, classes.dayCell)}>
										{isToday ? `${label} (aujourd'hui)` : label}
									</th>
									<td className={cx(hoursCell, classes.cellRight)}>
										{day?.closed
											? "Fermé"
											: day?.openTime && day?.closeTime
												? `${formatTime(day.openTime)} – ${formatTime(day.closeTime)}`
												: "–"}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				{scheduleNote && <p className={classes.note}>{scheduleNote}</p>}
			</section>
		);
	},
);

const useStyles = tss.withName({ PhoneSchedulePanel }).create({
	panel: {
		position: "absolute",
		top: "calc(100% - 32px)",
		left: "50%",
		transform: "translateX(-50%)",
		width: "320px",
		backgroundColor: fr.colors.decisions.background.default.grey.default,
		boxShadow: "var(--lifted-shadow)",
		padding: fr.spacing("2w"),
		zIndex: 100,
	},
	title: {
		fontSize: "1.25rem",
		fontWeight: 700,
		margin: `${fr.spacing("1w")} ${fr.spacing("2w")} ${fr.spacing("1w")} 0`,
	},
	table: {
		width: "100%",
		borderCollapse: "collapse",
	},
	visuallyHidden: {
		position: "absolute",
		width: 1,
		height: 1,
		padding: 0,
		margin: -1,
		overflow: "hidden",
		clip: "rect(0,0,0,0)",
		whiteSpace: "nowrap",
		border: 0,
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
	dayCell: {
		textAlign: "left",
		fontWeight: 400,
		fontSize: "14px",
	},
	cellRight: {
		textAlign: "right",
	},
	note: {
		fontSize: "0.875rem",
		color: fr.colors.decisions.text.mention.grey.default,
		margin: 0,
	},
});
