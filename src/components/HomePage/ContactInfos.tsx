import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";
import Tile from "@codegouvfr/react-dsfr/Tile";
import Button from "@codegouvfr/react-dsfr/Button";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { useEffect, useRef, useState } from "react";
import type { Home } from "~/payload/payload-types";
import { PhoneSchedulePanel } from "./PhoneScheduleModal";

const DAY_KEYS: Record<
	number,
	keyof NonNullable<Home["contact"]["phone"]["schedule"]>
> = {
	0: "dimanche",
	1: "lundi",
	2: "mardi",
	3: "mercredi",
	4: "jeudi",
	5: "vendredi",
	6: "samedi",
};

const parseTime = (t: string): number | null => {
	const match = t.match(/^(\d+)h(\d*)$/);
	if (!match) return null;
	return (
		parseInt(match[1] ?? "0", 10) * 60 +
		(match[2] ? parseInt(match[2], 10) || 0 : 0)
	);
};

function getNextOpenLabel(
	schedule: NonNullable<Home["contact"]["phone"]["schedule"]>,
	todayDow: number,
	_currentMinutes: number,
): string {
	for (let i = 1; i <= 6; i++) {
		const nextDow = (todayDow + i) % 7;
		const dayKey = DAY_KEYS[nextDow];
		if (!dayKey) continue;
		const nextEntry = schedule[dayKey];
		if (!nextEntry || nextEntry.closed || !nextEntry.openTime) continue;
		const label = i === 1 ? "demain" : dayKey;
		return `Réouvre ${label} à ${nextEntry.openTime}`;
	}
	return "";
}

function getPhoneStatus(schedule: Home["contact"]["phone"]["schedule"]) {
	if (!schedule) return { isOpen: null, todayLabel: "", closedLabel: "" };

	const now = new Date();
	const todayDow = now.getDay();
	const currentMinutes = now.getHours() * 60 + now.getMinutes();
	const entry = schedule[DAY_KEYS[todayDow] ?? "lundi"];

	if (!entry) return { isOpen: null, todayLabel: "", closedLabel: "" };

	if (entry.closed) {
		return {
			isOpen: false,
			todayLabel: "",
			closedLabel: getNextOpenLabel(schedule, todayDow, currentMinutes),
		};
	}

	if (!entry.openTime || !entry.closeTime)
		return { isOpen: null, todayLabel: "", closedLabel: "" };

	const openMin = parseTime(entry.openTime);
	const closeMin = parseTime(entry.closeTime);
	if (openMin === null || closeMin === null)
		return { isOpen: null, todayLabel: "", closedLabel: "" };
	const isOpen = currentMinutes >= openMin && currentMinutes < closeMin;

	if (isOpen) {
		return {
			isOpen: true,
			todayLabel: `Aujourd'hui, ${entry.openTime} – ${entry.closeTime}`,
			closedLabel: "",
		};
	}

	const closedLabel =
		currentMinutes < openMin
			? `Ouvre aujourd'hui à ${entry.openTime}`
			: getNextOpenLabel(schedule, todayDow, currentMinutes);

	return { isOpen: false, todayLabel: "", closedLabel };
}

type Props = {
	contactCMS: Home["contact"] | undefined;
};

export function ContactInfos({ contactCMS }: Props) {
	const { classes, cx } = useStyles();

	const { isOpen, todayLabel, closedLabel } = getPhoneStatus(
		contactCMS?.phone.schedule,
	);

	const [showSchedule, setShowSchedule] = useState(false);
	const phoneColumnRef = useRef<HTMLDivElement>(null);
	const schedulePanelRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (showSchedule) {
			schedulePanelRef.current?.focus();
		}
	}, [showSchedule]);

	useEffect(() => {
		if (!showSchedule) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (
				phoneColumnRef.current &&
				!phoneColumnRef.current.contains(e.target as Node)
			) {
				setShowSchedule(false);
			}
		};
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") setShowSchedule(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [showSchedule]);

	return (
		<div className={classes.sectionWrapper}>
			<div className={fr.cx("fr-container")}>
				<div className={fr.cx("fr-py-4w")}>
					<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
						<div
							ref={phoneColumnRef}
							className={cx(
								fr.cx("fr-col-12", "fr-col-md-4"),
								classes.phoneColumn,
							)}
						>
							<Tile
								title={contactCMS?.phone.title ?? "Par téléphone"}
								start={
									<span
										className={cx(
											fr.cx("fr-icon-phone-line"),
											classes.tileIcon,
										)}
										aria-hidden="true"
									/>
								}
								desc={
									<>
										<a
											href={`tel:${(contactCMS?.phone.number ?? "0800714040").replace(/\s/g, "")}`}
											className={classes.phoneNumber}
										>
											{contactCMS?.phone.number ?? "0 800 71 40 40"}
										</a>
										<span className={classes.phoneLabel}>
											{contactCMS?.phone.label ?? "Service et appel gratuits"}
										</span>
									</>
								}
								detail={
									<span className={classes.detailRow}>
										{isOpen !== null && (
											<>
												<span
													aria-hidden="true"
													className={cx(
														classes.statusDot,
														isOpen
															? classes.statusDotOpen
															: classes.statusDotClosed,
													)}
												/>
												<Badge
													noIcon
													small
													severity={isOpen ? "success" : "error"}
												>
													{isOpen ? "OUVERT" : "FERMÉ"}
												</Badge>
												{isOpen ? todayLabel : closedLabel}
											</>
										)}
										<button
											type="button"
											aria-label="Voir les horaires de la ligne"
											aria-expanded={showSchedule}
											aria-controls="phone-schedule-panel"
											onClick={() => setShowSchedule((v) => !v)}
											className={cx(
												fr.cx(
													"fr-btn",
													"fr-btn--sm",
													"fr-icon-information-line",
												),
												"fr-btn--tertiary-no-outline",
												classes.scheduleButton,
											)}
										/>
									</span>
								}
								noIcon
								classes={{
									root: cx(classes.tileLeft, classes.tilePhoneDetail),
								}}
							/>
							{showSchedule && (
								<PhoneSchedulePanel
									ref={schedulePanelRef}
									schedule={contactCMS?.phone.schedule}
									scheduleNote={contactCMS?.phone.scheduleNote}
								/>
							)}
						</div>
						<div className={fr.cx("fr-col-12", "fr-col-md-4")}>
							<Tile
								title={contactCMS?.contactForm?.title ?? "Par écrit"}
								start={
									<span
										className={cx(fr.cx("fr-icon-mail-line"), classes.tileIcon)}
										aria-hidden="true"
									/>
								}
								desc={contactCMS?.contactForm?.description ?? ""}
								detail={
									<div className={classes.tileButtonWrapper}>
										<Button
											priority="secondary"
											iconId="fr-icon-arrow-right-line"
											iconPosition="right"
											linkProps={{
												href: contactCMS?.contactForm?.url ?? "/contact",
											}}
										>
											{contactCMS?.contactForm?.buttonLabel ??
												"Écrire au service"}
										</Button>
									</div>
								}
								noIcon
								classes={{ root: classes.tileLeft }}
							/>
						</div>
						<div className={fr.cx("fr-col-12", "fr-col-md-4")}>
							<Tile
								title={contactCMS?.directory?.title ?? "Annuaire"}
								start={
									<span
										className={cx(
											fr.cx("fr-icon-map-pin-user-line"),
											classes.tileIcon,
										)}
										aria-hidden="true"
									/>
								}
								desc={contactCMS?.directory?.description ?? ""}
								detail={
									<div className={classes.tileButtonWrapper}>
										<Button
											priority="secondary"
											iconId="fr-icon-external-link-line"
											iconPosition="right"
											linkProps={{
												href:
													contactCMS?.directory?.url ??
													"https://annuaire.maisondelautisme.gouv.fr",
												target: "_blank",
												rel: "noopener noreferrer",
											}}
										>
											{contactCMS?.directory?.buttonLabel ??
												"Consulter l'annuaire"}
										</Button>
									</div>
								}
								noIcon
								classes={{ root: classes.tileLeft }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const useStyles = tss.withName({ ContactInfos }).create({
	sectionWrapper: {
		background: `linear-gradient(to bottom, transparent 50%, ${fr.colors.decisions.background.alt.blueFrance.default} 50%)`,
	},
	phoneNumber: {
		display: "block",
		fontSize: "1.75rem",
		fontWeight: 700,
		color: fr.colors.decisions.text.actionHigh.blueFrance.default,
		marginBottom: "8px",
		backgroundImage: "none",
		"&:hover": {
			backgroundImage: "none",
		},
	},
	phoneLabel: {
		fontSize: "0.875rem",
		color: fr.colors.decisions.text.mention.grey.default,
	},
	detailRow: {
		display: "flex",
		alignItems: "center",
		gap: "12px",
		flexWrap: "wrap",
	},
	statusDot: {
		width: 10,
		height: 10,
		borderRadius: "50%",
		display: "inline-block",
		flexShrink: 0,
		marginInline: 5,
	},
	statusDotOpen: {
		backgroundColor: "#18753c",
		boxShadow: "0 0 0 5px rgba(24,117,60,0.2)",
	},
	statusDotClosed: {
		backgroundColor: "#c9191e",
		boxShadow: "0 0 0 5px rgba(201,25,30,0.2)",
	},
	phoneColumn: {
		position: "relative",
	},
	tileButtonWrapper: {
		marginTop: fr.spacing("3w"),
	},
	scheduleButton: {
		flexShrink: 0,
	},
	tileIcon: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		width: "56px",
		height: "56px",
		borderRadius: "50%",
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		color: fr.colors.decisions.text.actionHigh.blueFrance.default,
		"&::before": {
			"--icon-size": "1.5rem",
		},
	},
	tilePhoneDetail: {
		"& .fr-tile__desc": {
			flexGrow: 0,
		},
	},
	tileLeft: {
		"& .fr-tile__header": {
			justifyContent: "flex-start",
		},
		"& .fr-tile__body": {
			alignItems: "flex-start",
			textAlign: "left",
		},
		"& .fr-tile__content": {
			alignItems: "flex-start",
		},
		"& .fr-tile__title:before": {
			backgroundImage:
				"linear-gradient(0deg,var(--border-active-blue-france),var(--border-active-blue-france))",
		},
		"& .fr-tile__title": {
			marginBottom: "0.75rem",
		},
	},
});
