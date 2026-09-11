import { fr } from "@codegouvfr/react-dsfr";
import Summary, { type SummaryProps } from "@codegouvfr/react-dsfr/Summary";
import { useEffect, useMemo, useState } from "react";
import { tss } from "tss-react/dsfr";
import type { Link } from "~/utils/tools";

const DESKTOP_QUERY = "(min-width: 62em)";
const ACTIVE_OFFSET = 120;

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
			setActiveHref(
				hrefs.reduce<string | null>((found, href) => {
					const target = document.getElementById(href.slice(1));
					if (!target) return found;
					return target.getBoundingClientRect().top <= ACTIVE_OFFSET
						? href
						: found;
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

const useStyles = tss.withName(SummaryContent.name).create(() => ({
	summary: {
		".fr-summary__link[aria-current]": {
			fontWeight: 700,
		},
	},
}));
