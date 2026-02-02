import { fr } from "@codegouvfr/react-dsfr";
import { SearchBarUI } from "../ui/SearchPage/SearchBarUI";
import { useMemo, useState } from "react";
import { courseQuery, practicalGuideQuery, slugify } from "~/utils/tools";
import type { AugmentedJourney } from "~/server/api/routers/journeys";
import { useRouter } from "next/router";
import { tss } from "tss-react";
import SummaryContent from "../ui/PracticalGuides/SummaryContent";
import { useSearchParams } from "next/navigation";
import { EmptyScreenZone } from "../ui/EmptyScreenZone";
import PersonaContent from "../ui/PersonaPage/PersonaContent";

export default function PersonaDisplay({
	journey,
	viewCourses,
}: {
	journey: AugmentedJourney;
	viewCourses: boolean;
}) {
	const { classes, cx } = useStyles();

	const searchParams = useSearchParams();
	const search = searchParams?.get("search");

	const router = useRouter();
	const routerCondition = router.query.condition as string;

	const [query, setQuery] = useState<string>(search ?? "");

	const filteredChapters = useMemo(() => {
		const loweredQuery = query.toLowerCase();

		return journey.chapter.map((chap) => ({
			name: chap["chapter-name"],
			guides: chap["practical-guides"].filter((guide) =>
				practicalGuideQuery(guide, routerCondition, loweredQuery),
			),
			courses:
				chap.courses?.filter((course) =>
					courseQuery(course, routerCondition, loweredQuery),
				) ?? [],
		}));
	}, [query]);

	if (!filteredChapters || filteredChapters.length === 0)
		return <EmptyScreenZone>Parcours introuvable</EmptyScreenZone>;

	const currentList = viewCourses
		? filteredChapters.filter((chap) => chap.courses.length > 0)
		: filteredChapters.filter((chap) => chap.guides.length > 0);

	const chapterLinks = currentList.map((chap) => ({
		linkProps: {
			href: `#${slugify(chap.name)}`,
		},
		text: chap.name,
	}));

	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
			<SummaryContent
				className={cx(classes.whiteSummarySticky)}
				title="Thématiques"
				menuLinks={chapterLinks ?? []}
			/>
			<div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
				<SearchBarUI value={query} onClick={(query) => setQuery(query)} />
				{viewCourses
					? currentList.map((chap) => (
							<div key={`Course ${chap.name}`}>
								<PersonaContent
									courses={chap.courses}
									chapterName={chap.name}
									viewCourse={viewCourses}
								/>
							</div>
						))
					: currentList.map((chap) => (
							<div key={`Guides ${chap.name}`}>
								<PersonaContent
									guides={chap.guides}
									chapterName={chap.name}
									viewCourse={viewCourses}
								/>
							</div>
						))}
			</div>
		</div>
	);
}

const useStyles = tss.withName(PersonaDisplay.name).create(() => ({
	whiteSummarySticky: {
		position: "sticky",
		top: "20px",
		".fr-summary__link:before": {
			visibility: "hidden",
		},
		backgroundColor: fr.colors.decisions.background.default.grey.default,
	},
}));
