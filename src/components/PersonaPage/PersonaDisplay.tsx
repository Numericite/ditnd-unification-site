import { fr } from "@codegouvfr/react-dsfr";
import Summary from "@codegouvfr/react-dsfr/Summary";
import { SearchBarUI } from "../ui/SearchPage/SearchBarUI";
import { useEffect, useState } from "react";
import { slugify } from "~/utils/tools";
import type { AugmentedJourney, Chapter } from "~/server/api/routers/journeys";
import { useRouter } from "next/router";
import PersonaGuidesContent from "../ui/PersonaPage/PersonaGuidesContent";
import { tss } from "tss-react";
import PersonaCoursesContent from "../ui/PersonaPage/PersonaCoursesContent";

export default function PersonaDisplay({
	journey,
	viewCourses,
}: {
	journey: AugmentedJourney;
	viewCourses: boolean;
}) {
	const { classes, cx } = useStyles();

	const [query, setQuery] = useState<string>("");
	const [chaptersList, setChapterList] = useState<Chapter[]>();

	const router = useRouter();
	const routerCondition = router.query.condition as string;

	const chapterLinks = journey.chapter.map((chap) => ({
		linkProps: {
			href: `#${slugify(chap["chapter-name"])}`,
		},
		text: chap["chapter-name"],
	}));

	useEffect(() => {
		if (!query) {
			setChapterList(journey.chapter);
		} else {
			const loweredQuery = query.toLowerCase();
			const res = chaptersList?.map((chap) => ({
				...chap,
				"practical-guides": chap["practical-guides"].filter(
					(pg) =>
						pg.description.toLowerCase().includes(loweredQuery) ||
						pg.title.toLowerCase().includes(loweredQuery) ||
						pg.conditions.some((c) =>
							c.slug.toLowerCase().includes(loweredQuery),
						) ||
						pg.theme[0]?.name.toLowerCase().includes(loweredQuery),
				),
			}));
			setChapterList(res);
		}
	}, [query]);

	if (!chaptersList || chaptersList.length === 0)
		return <div>Parcours introuvable</div>;

	return (
		<div className={fr.cx("fr-grid-row")}>
			<div
				className={fr.cx(
					"fr-pr-3v",
					"fr-col-12",
					"fr-col-lg-4",
					"fr-col-md-12",
					"fr-col-sm-12",
					"fr-mb-2w",
				)}
			>
				<Summary
					className={cx(classes.summarySticky)}
					links={chapterLinks}
					title="Thématiques"
				/>
			</div>
			<div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
				<SearchBarUI
					onClick={(query) => {
						setQuery(query);
					}}
				/>
				{chaptersList.map((chap, index) => (
					<div key={index} className={fr.cx("fr-pt-3w")}>
						<h3 id={slugify(chap["chapter-name"])}>{chap["chapter-name"]}</h3>

						<div
							key={chap.id}
							className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}
						>
							{viewCourses ? (
								<PersonaCoursesContent
									value={chap.courses}
									condition={routerCondition}
									query={query}
								/>
							) : (
								<PersonaGuidesContent
									value={chap["practical-guides"]}
									condition={routerCondition}
								/>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

const useStyles = tss.withName(PersonaDisplay.name).create(() => ({
	summarySticky: {
		position: "sticky",
		top: "20px",
		".fr-summary__link:before": {
			visibility: "hidden",
		},
	},
}));
