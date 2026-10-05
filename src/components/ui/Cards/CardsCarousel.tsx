import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useId,
	useRef,
	useState,
} from "react";
import { tss } from "tss-react/dsfr";

type HeadingLevel = "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
	items: { key: string; card: ReactNode }[];
	label: string;
	title?: string;
	titleAs?: HeadingLevel;
	titleId?: string;
};

type Position = {
	first: number;
	last: number;
	atStart: boolean;
	atEnd: boolean;
};

const SETTLE_DELAY = 150;

const samePosition = (a: Position, b: Position) =>
	a.first === b.first &&
	a.last === b.last &&
	a.atStart === b.atStart &&
	a.atEnd === b.atEnd;

const visibleRange = ({ first, last }: Position, total: number) =>
	first === last
		? `Carte ${first + 1} sur ${total}`
		: `Cartes ${first + 1} à ${last + 1} sur ${total}`;

export default function CardsCarousel({
	items,
	label,
	title,
	titleAs: Title = "h3",
	titleId,
}: Props) {
	const { classes } = useStyles();
	const id = useId();
	const listId = `${id}-list`;
	const headingId = titleId ?? `${id}-title`;
	const listRef = useRef<HTMLUListElement>(null);
	const previousRef = useRef<HTMLButtonElement>(null);
	const nextRef = useRef<HTMLButtonElement>(null);
	const targetRef = useRef<number | null>(null);
	const pendingFocusRef = useRef<HTMLButtonElement | null>(null);
	const [position, setPosition] = useState<Position>({
		first: 0,
		last: 0,
		atStart: true,
		atEnd: true,
	});
	const [announcement, setAnnouncement] = useState("");

	const total = items.length;
	const overflowing = !(position.atStart && position.atEnd);

	const measure = useCallback(() => {
		const list = listRef.current;
		if (!list) return null;

		const bounds = list.getBoundingClientRect();
		const visible = Array.from(list.children).flatMap((item, index) => {
			const { left, width } = item.getBoundingClientRect();
			const center = left + width / 2;
			return center >= bounds.left && center <= bounds.right ? [index] : [];
		});
		const maxScroll = list.scrollWidth - list.clientWidth;
		const next: Position = {
			first: visible[0] ?? 0,
			last: visible.at(-1) ?? 0,
			atStart: list.scrollLeft <= 1,
			atEnd: list.scrollLeft >= maxScroll - 1,
		};

		if (!(next.atStart && next.atEnd)) {
			if (next.atStart && document.activeElement === previousRef.current)
				pendingFocusRef.current = nextRef.current;
			if (next.atEnd && document.activeElement === nextRef.current)
				pendingFocusRef.current = previousRef.current;
		}

		setPosition((current) => (samePosition(current, next) ? current : next));
		return next;
	}, []);

	useEffect(() => {
		const target = pendingFocusRef.current;
		if (!target || target.disabled) return;
		pendingFocusRef.current = null;
		const active = document.activeElement;
		if (
			!active ||
			active === document.body ||
			active === previousRef.current ||
			active === nextRef.current
		)
			target.focus();
	});

	useEffect(() => {
		const list = listRef.current;
		if (!list || total === 0) return;

		let frame = 0;
		let settleTimer: ReturnType<typeof setTimeout> | undefined;
		const supportsScrollEnd = "onscrollend" in window;

		const settle = () => {
			const settled = measure();
			if (
				settled &&
				targetRef.current !== null &&
				Math.abs(list.scrollLeft - targetRef.current) < 2
			) {
				targetRef.current = null;
				setAnnouncement(visibleRange(settled, total));
			}
		};

		const onScroll = () => {
			if (!frame)
				frame = requestAnimationFrame(() => {
					frame = 0;
					measure();
				});
			if (supportsScrollEnd) return;
			clearTimeout(settleTimer);
			settleTimer = setTimeout(settle, SETTLE_DELAY);
		};

		const observer = new ResizeObserver(() => measure());
		observer.observe(list);
		list.addEventListener("scroll", onScroll, { passive: true });
		if (supportsScrollEnd) list.addEventListener("scrollend", settle);
		measure();

		return () => {
			observer.disconnect();
			list.removeEventListener("scroll", onScroll);
			list.removeEventListener("scrollend", settle);
			if (frame) cancelAnimationFrame(frame);
			clearTimeout(settleTimer);
		};
	}, [measure, total]);

	const scrollByPage = (direction: -1 | 1) => {
		const list = listRef.current;
		if (!list) return;

		const cards = Array.from(list.children) as HTMLElement[];
		const pageSize = Math.max(1, position.last - position.first + 1);
		const targetIndex = Math.min(
			Math.max(position.first + direction * pageSize, 0),
			cards.length - 1,
		);
		const target = cards[targetIndex];
		const origin = cards[0];
		if (!target || !origin) return;

		const left = Math.min(
			target.offsetLeft - origin.offsetLeft,
			list.scrollWidth - list.clientWidth,
		);
		if (Math.abs(left - list.scrollLeft) < 1) return;

		targetRef.current = left;
		const reduceMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		list.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
	};

	if (total === 0) return null;

	const counter =
		position.first === position.last
			? `${position.first + 1} / ${total}`
			: `${position.first + 1}–${position.last + 1} / ${total}`;

	return (
		<section
			{...(title ? { "aria-labelledby": headingId } : { "aria-label": label })}
			className={classes.root}
		>
			{(title || overflowing) && (
				<div className={classes.header}>
					{title && (
						<Title id={headingId} className={classes.title}>
							{title}
						</Title>
					)}
					{overflowing && (
						<div className={classes.controls}>
							<p className={classes.counter} aria-hidden="true">
								{counter}
							</p>
							<Button
								ref={previousRef}
								iconId="fr-icon-arrow-left-s-line"
								priority="tertiary"
								title="Cartes précédentes"
								disabled={position.atStart}
								onClick={() => scrollByPage(-1)}
								nativeButtonProps={{
									"aria-label": "Cartes précédentes",
									"aria-controls": listId,
								}}
							/>
							<Button
								ref={nextRef}
								iconId="fr-icon-arrow-right-s-line"
								priority="tertiary"
								title="Cartes suivantes"
								disabled={position.atEnd}
								onClick={() => scrollByPage(1)}
								nativeButtonProps={{
									"aria-label": "Cartes suivantes",
									"aria-controls": listId,
								}}
							/>
						</div>
					)}
				</div>
			)}
			<p className={fr.cx("fr-sr-only")} aria-live="polite">
				{announcement}
			</p>
			<ul id={listId} ref={listRef} className={classes.list} data-carousel>
				{items.map(({ key, card }) => (
					<li key={key} className={classes.item}>
						{card}
					</li>
				))}
			</ul>
		</section>
	);
}

const useStyles = tss.withName({ CardsCarousel }).create(() => ({
	root: {
		marginBottom: fr.spacing("3w"),
	},
	header: {
		display: "flex",
		flexWrap: "wrap",
		alignItems: "center",
		justifyContent: "space-between",
		gap: fr.spacing("2v"),
		marginBottom: fr.spacing("2w"),
	},
	title: {
		margin: 0,
	},
	controls: {
		display: "flex",
		alignItems: "center",
		gap: fr.spacing("2v"),
		marginInlineStart: "auto",
	},
	counter: {
		margin: 0,
		color: fr.colors.decisions.text.mention.grey.default,
		fontSize: "0.875rem",
		lineHeight: "1.5rem",
		fontVariantNumeric: "tabular-nums",
	},
	list: {
		display: "flex",
		gap: fr.spacing("3w"),
		margin: `0 -${fr.spacing("1v")}`,
		padding: `${fr.spacing("1v")} ${fr.spacing("1v")} ${fr.spacing("3v")}`,
		listStyle: "none",
		overflowX: "auto",
		overscrollBehaviorX: "contain",
		scrollSnapType: "x mandatory",
		scrollPaddingInline: fr.spacing("1v"),
	},
	item: {
		display: "flex",
		flex: "0 0 min(21.875rem, 85%)",
		padding: 0,
		scrollSnapAlign: "start",
		"& > *": {
			width: "100%",
		},
	},
}));
