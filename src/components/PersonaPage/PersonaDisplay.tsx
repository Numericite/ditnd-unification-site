import { fr } from "@codegouvfr/react-dsfr";
import Summary from "@codegouvfr/react-dsfr/Summary";
import { SearchBarUI } from "../ui/SearchPage/SearchBarUI";
import { useState } from "react";
import { slugify } from "~/utils/tools";
import type { AugmentedJourney } from "~/server/api/routers/journeys";
import { useRouter } from "next/router";
import PersonaGuidesContent, {
	practicalGuideQuery,
} from "../ui/PersonaPage/PersonaGuidesContent";
import { tss } from "tss-react";
import PersonaCoursesContent, {
	courseQuery,
} from "../ui/PersonaPage/PersonaCoursesContent";

export default function PersonaDisplay({
	journey,
	viewCourses,
}: {
	journey: AugmentedJourney;
	viewCourses: boolean;
}) {
	const { classes, cx } = useStyles();

	const [query, setQuery] = useState<string>("");

	const router = useRouter();
	const routerCondition = router.query.condition as string;

	const chaptersList = journey.chapter;

	if (!chaptersList || chaptersList.length === 0)
		return <div>Parcours introuvable</div>;

	const guidesList = chaptersList.map((chap) => ({
		name: chap["chapter-name"],
		guides: chap["practical-guides"],
	}));

	const coursesList = chaptersList.map((chap) => ({
		name: chap["chapter-name"],
		courses: chap.courses,
	}));

	const filteredGuidesList = guidesList
		.map((chap) => ({
			content: chap.guides.filter((guide) =>
				practicalGuideQuery(guide, routerCondition, query.toLowerCase()),
			),
			name: chap.name,
		}))
		.filter((chap) => chap.content.length > 0);

	const filteredCoursesList = coursesList
		.map((chap) => ({
			content: chap.courses.filter((course) =>
				courseQuery(course, routerCondition, query.toLocaleLowerCase()),
			),
			name: chap.name,
		}))
		.filter((chap) => chap.content.length > 0);

	const currentList = viewCourses ? filteredCoursesList : filteredGuidesList;

	const chapterLinks = currentList.map((chap) => ({
		linkProps: {
			href: `#${slugify(chap.name)}`,
		},
		text: chap.name,
	}));

	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
			<div
				className={fr.cx(
					"fr-col-12",
					"fr-col-lg-4",
					"fr-col-md-12",
					"fr-col-sm-12",
					"fr-mb-2w",
				)}
			>
				<Summary
					className={cx(classes.whiteSummarySticky)}
					links={chapterLinks ?? []}
					title="Thématiques"
				/>
			</div>
			<div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
				<SearchBarUI onClick={(query) => setQuery(query)} />
				{viewCourses
					? filteredCoursesList.map((chap) => (
							<div key={`Course ${chap.name}`}>
								<PersonaCoursesContent
									value={chap.content}
									chapterName={chap.name}
								/>
							</div>
						))
					: filteredGuidesList.map((chap) => (
							<div key={`Guides ${chap.name}`}>
								<PersonaGuidesContent
									value={chap.content}
									chapterName={chap.name}
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
