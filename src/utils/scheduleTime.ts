// Phone line hours are stored as full dates by Payload's time picker and are
// always read in Paris time, whatever the visitor's timezone. Days follow
// Date.getDay() (0 = Sunday); the Paris weekday comes from the Paris calendar
// date read back in UTC.

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type StoredTime = string | Date | null | undefined;

export type ParisMoment = { dayOfWeek: DayOfWeek; minutesOfDay: number };

const parisClock = new Intl.DateTimeFormat("en-US", {
	timeZone: "Europe/Paris",
	year: "numeric",
	month: "numeric",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	hourCycle: "h23",
});

const toParisMoment = (date: Date): ParisMoment => {
	const {
		year = 0,
		month = 1,
		day = 1,
		hour = 0,
		minute = 0,
	} = Object.fromEntries(
		parisClock.formatToParts(date).map((p) => [p.type, Number(p.value)]),
	);
	const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
	return { dayOfWeek: weekday as DayOfWeek, minutesOfDay: hour * 60 + minute };
};

export const addDays = (day: DayOfWeek, count: number): DayOfWeek =>
	((((day + count) % 7) + 7) % 7) as DayOfWeek;

export const toMinutes = (value: StoredTime): number | null => {
	const date = value ? new Date(value) : null;
	return date && !Number.isNaN(date.getTime())
		? toParisMoment(date).minutesOfDay
		: null;
};

export const formatTime = (value: StoredTime): string => {
	const minutes = toMinutes(value);
	if (minutes === null) return "";
	const m = minutes % 60;
	return `${Math.floor(minutes / 60)}h${m ? String(m).padStart(2, "0") : ""}`;
};

export const getParisNow = (): ParisMoment => toParisMoment(new Date());
