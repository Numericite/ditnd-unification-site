import { fr } from "@codegouvfr/react-dsfr";
import Summary, { type SummaryProps } from "@codegouvfr/react-dsfr/Summary";
import { useEffect, useMemo, useRef, useState } from "react";
import { tss } from "tss-react/dsfr";
import type { Link } from "~/utils/tools";

const DESKTOP_QUERY = "(min-width: 62em)";
const ACTIVE_OFFSET = 120;

function activeOffset() {
	const pinnedHeader = Number.parseFloat(
		getComputedStyle(document.documentElement).getPropertyValue(
			"--sticky-header-height",
		),
	);
	return (Number.isNaN(pinnedHeader) ? 0 : pinnedHeader) + ACTIVE_OFFSET;
}

function useActiveLinkHref(menuLinks: Link[]): string | null {
	const [activeHref, setActiveHref] = useState<string | null>(null);

	const anchors = menuLinks
		.map((link) => link.linkProps.href)
		.filter(
			(href): href is string =>
				typeof href === "string" && href.startsWith("#"),
		)
		.join(" ");

	useEffect(() => {
		const hrefs = anchors.split(" ").filter(Boolean);
		if (hrefs.length === 0) return;

		const mediaQuery = window.matchMedia(DESKTOP_QUERY);
		let frame = 0;

		const update = () => {
			frame = 0;
			const offset = activeOffset();
			setActiveHref(
				hrefs.reduce<string | null>((found, href) => {
					const target = document.getElementById(href.slice(1));
					if (!target) return found;
					return target.getBoundingClientRect().top <= offset ? href : found;
				}, null),
			);
		};

		const onScroll = () => {
			if (frame) return;
			frame = requestAnimationFrame(update);
		};

		const start = () => {
			window.addEventListener("scroll", onScroll, { passive: true });
			update();
		};

		const stop = () => {
			window.removeEventListener("scroll", onScroll);
			if (frame) cancelAnimationFrame(frame);
			frame = 0;
			setActiveHref(null);
		};

		const onMediaChange = (event: MediaQueryListEvent) =>
			event.matches ? start() : stop();

		if (mediaQuery.matches) start();
		mediaQuery.addEventListener("change", onMediaChange);

		return () => {
			mediaQuery.removeEventListener("change", onMediaChange);
			stop();
		};
	}, [anchors]);

	return activeHref;
}

type Props = {
	menuLinks: Link[];
	className?: string;
	title: string;
	as?: SummaryProps["as"];
};

export default function SummaryContent({
	menuLinks,
	className,
	title,
	as = "h2",
}: Props) {
	const { classes, cx } = useStyles();
	const activeHref = useActiveLinkHref(menuLinks);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!activeHref) return;
		const list =
			containerRef.current?.querySelector<HTMLElement>(".fr-summary > ol");
		const active = list?.querySelector<HTMLElement>(
			".fr-summary__link[aria-current]",
		);
		if (!list || !active) return;

		const listBox = list.getBoundingClientRect();
		const activeBox = active.getBoundingClientRect();
		if (activeBox.top < listBox.top) {
			list.scrollTop += activeBox.top - listBox.top;
		} else if (activeBox.bottom > listBox.bottom) {
			list.scrollTop += activeBox.bottom - listBox.bottom;
		}
	}, [activeHref]);

	const links = useMemo(
		() =>
			menuLinks.map((link) =>
				link.linkProps.href === activeHref
					? {
							...link,
							linkProps: {
								...link.linkProps,
								"aria-current": "true" as const,
							},
						}
					: link,
			),
		[menuLinks, activeHref],
	);

	return (
		<div
			ref={containerRef}
			className={cx(
				fr.cx(
					"fr-col-12",
					"fr-col-lg-3",
					"fr-col-md-12",
					"fr-col-sm-12",
					"fr-mb-2w",
				),
				classes.summary,
			)}
		>
			<Summary
				id="summary"
				className={className}
				links={links}
				title={title}
				as={as}
			/>
		</div>
	);
}

const useStyles = tss.withName({ SummaryContent }).create(() => ({
	summary: {
		".fr-summary": {
			"--summary-padding": "1.5rem",
			[fr.breakpoints.up("md")]: {
				"--summary-padding": "2rem",
			},
			display: "flex",
			flexDirection: "column",
			maxHeight: "calc(100vh - var(--sticky-top) - 1.25rem)",
			"@supports (height: 100dvh)": {
				maxHeight: "calc(100dvh - var(--sticky-top) - 1.25rem)",
			},
			paddingRight: 0,
			"> .fr-summary__title": {
				paddingRight: "var(--summary-padding)",
			},
			"> ol": {
				minHeight: 0,
				overflowY: "auto",
				overscrollBehavior: "contain",
				paddingRight: "var(--summary-padding)",
				scrollbarGutter: "stable",
				"&::-webkit-scrollbar": {
					width: "0.375rem",
				},
				"&::-webkit-scrollbar-track": {
					backgroundColor: "transparent",
				},
				"&::-webkit-scrollbar-thumb": {
					backgroundColor: fr.colors.decisions.background.contrast.grey.active,
					borderRadius: "0.1875rem",
				},
				"@supports (scrollbar-width: thin) and (not selector(::-webkit-scrollbar))":
					{
						scrollbarWidth: "thin",
						scrollbarColor: `${fr.colors.decisions.background.contrast.grey.active} transparent`,
					},
			},
		},
		".fr-summary__link[aria-current]": {
			fontWeight: 700,
		},
	},
}));
