import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";
import Tile from "@codegouvfr/react-dsfr/Tile";
import Button from "@codegouvfr/react-dsfr/Button";
import Badge from "@codegouvfr/react-dsfr/Badge";
import { useEffect, useRef, useState } from "react";
import type { Home } from "~/payload/payload-types";
import { PhoneSchedulePanel } from "./PhoneScheduleModal";
import {
	addDays,
	type DayOfWeek,
	formatTime,
	getParisNow,
	toMinutes,
} from "~/utils/scheduleTime";

type Schedule = NonNullable<Home["contact"]["phone"]["schedule"]>;

const DAY_KEYS: Readonly<Record<DayOfWeek, keyof Schedule>> = {
	0: "dimanche",
	1: "lundi",
	2: "mardi",
	3: "mercredi",
	4: "jeudi",
	5: "vendredi",
	6: "samedi",
};

type PhoneStatus = {
	/** null when the status cannot be computed (missing or invalid hours). */
	isOpen: boolean | null;
	todayLabel: string;
	closedLabel: string;
};

const UNKNOWN_STATUS: PhoneStatus = {
	isOpen: null,
	todayLabel: "",
	closedLabel: "",
};

function getNextOpenLabel(schedule: Schedule, today: DayOfWeek): string {
	// Up to 7 days ahead: the next opening can be the same weekday, next week
	for (let i = 1; i <= 7; i++) {
		const dayKey = DAY_KEYS[addDays(today, i)];
		const nextEntry = schedule[dayKey];
		if (!nextEntry || nextEntry.closed || !nextEntry.openTime) continue;
		const label = i === 1 ? "demain" : i === 7 ? `${dayKey} prochain` : dayKey;
		return `Réouvre ${label} à ${formatTime(nextEntry.openTime)}`;
	}
	return "";
}

function getPhoneStatus(schedule: Schedule | null | undefined): PhoneStatus {
	if (!schedule) return UNKNOWN_STATUS;

	const { dayOfWeek: today, minutesOfDay: currentMinutes } = getParisNow();
	const entry = schedule[DAY_KEYS[today]];

	if (!entry) return UNKNOWN_STATUS;

	if (entry.closed) {
		return {
			isOpen: false,
			todayLabel: "",
			closedLabel: getNextOpenLabel(schedule, today),
		};
	}

	const openMin = toMinutes(entry.openTime);
	const closeMin = toMinutes(entry.closeTime);
	if (openMin === null || closeMin === null) return UNKNOWN_STATUS;
	const isOpen = currentMinutes >= openMin && currentMinutes < closeMin;

	if (isOpen) {
		return {
			isOpen: true,
			todayLabel: `Aujourd'hui, ${formatTime(entry.openTime)} – ${formatTime(entry.closeTime)}`,
			closedLabel: "",
		};
	}

	const closedLabel =
		currentMinutes < openMin
			? `Ouvre aujourd'hui à ${formatTime(entry.openTime)}`
			: getNextOpenLabel(schedule, today);

	return { isOpen: false, todayLabel: "", closedLabel };
}

function usePhoneStatus(schedule: Schedule | null | undefined): PhoneStatus {
	const [status, setStatus] = useState<PhoneStatus>(UNKNOWN_STATUS);
	useEffect(() => {
		const update = () => setStatus(getPhoneStatus(schedule));
		update();
		const interval = setInterval(update, 60_000);
		return () => clearInterval(interval);
	}, [schedule]);
	return status;
}

type Props = {
	contactCMS: Home["contact"] | undefined;
};

export function ContactInfos({ contactCMS }: Props) {
	const { classes, cx } = useStyles();

	const { isOpen, todayLabel, closedLabel } = usePhoneStatus(
		contactCMS?.phone.schedule,
	);

	const [showSchedule, setShowSchedule] = useState(false);
	const phoneColumnRef = useRef<HTMLDivElement>(null);
	const schedulePanelRef = useRef<HTMLElement>(null);
	const scheduleButtonRef = useRef<HTMLButtonElement>(null);

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
			if (e.key !== "Escape") return;
			setShowSchedule(false);
			scheduleButtonRef.current?.focus();
		};
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [showSchedule]);

	const phone = contactCMS?.phone;
	const phoneNumber = phone?.number ?? "0 800 71 40 40";
	const contactForm = contactCMS?.contactForm;
	const directory = contactCMS?.directory;
	const directoryLabel = directory?.buttonLabel ?? "Consulter l'annuaire";

	return (
		<div className={classes.sectionWrapper}>
			<div className={fr.cx("fr-container")}>
				<div className={fr.cx("fr-py-4w")}>
					<h2 className={fr.cx("fr-sr-only")}>Nous contacter</h2>
					<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
						<div
							ref={phoneColumnRef}
							className={cx(
								fr.cx("fr-col-12", "fr-col-md-4"),
								classes.phoneColumn,
							)}
						>
							<Tile
								title={phone?.title ?? "Par téléphone"}
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
											href={`tel:${phoneNumber.replace(/\s/g, "")}`}
											className={classes.phoneNumber}
										>
											{phoneNumber}
										</a>
										<span className={classes.phoneLabel}>
											{phone?.label ?? "Service et appel gratuits"}
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
														classes.statusHalo,
														isOpen ? classes.statusOpen : classes.statusClosed,
													)}
												>
													<span className={classes.statusDot} />
												</span>
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
											ref={scheduleButtonRef}
											type="button"
											aria-label="Voir les horaires de la ligne"
											aria-expanded={showSchedule}
											aria-controls={
												showSchedule ? "phone-schedule-panel" : undefined
											}
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
									schedule={phone?.schedule}
									scheduleNote={phone?.scheduleNote}
								/>
							)}
						</div>
						<div className={fr.cx("fr-col-12", "fr-col-md-4")}>
							<Tile
								title={contactForm?.title ?? "Par écrit"}
								start={
									<span
										className={cx(fr.cx("fr-icon-mail-line"), classes.tileIcon)}
										aria-hidden="true"
									/>
								}
								desc={contactForm?.description ?? ""}
								detail={
									<Button
										priority="secondary"
										iconId="fr-icon-arrow-right-line"
										iconPosition="right"
										linkProps={{
											href: contactForm?.url ?? "/contact-particuliers",
										}}
									>
										{contactForm?.buttonLabel ?? "Écrire au service"}
									</Button>
								}
								noIcon
								classes={{ root: classes.tileLeft }}
							/>
						</div>
						<div className={fr.cx("fr-col-12", "fr-col-md-4")}>
							<Tile
								title={directory?.title ?? "Annuaire"}
								start={
									<span
										className={cx(
											fr.cx("fr-icon-map-pin-user-line"),
											classes.tileIcon,
										)}
										aria-hidden="true"
									/>
								}
								desc={directory?.description ?? ""}
								detail={
									<Button
										priority="secondary"
										iconId="fr-icon-external-link-line"
										iconPosition="right"
										linkProps={{
											href:
												directory?.url ??
												"https://annuaire.autismeinfoservice.fr/",
											target: "_blank",
											rel: "noopener noreferrer",
											title: `${directoryLabel} - nouvelle fenêtre`,
										}}
									>
										{directoryLabel}
									</Button>
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
	statusHalo: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		width: 20,
		height: 20,
		borderRadius: "50%",
		flexShrink: 0,
		backgroundColor: "color-mix(in srgb, var(--status-color) 20%, transparent)",
	},
	statusDot: {
		width: 10,
		height: 10,
		borderRadius: "50%",
		backgroundColor: "var(--status-color)",
	},
	statusOpen: {
		"--status-color": fr.colors.decisions.background.flat.success.default,
	},
	statusClosed: {
		"--status-color": fr.colors.decisions.background.flat.error.default,
	},
	phoneColumn: {
		position: "relative",
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
