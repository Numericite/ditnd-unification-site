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
import InfoOrCoursesButtons from "../ui/PersonaPage/InfoOrCoursesButtons";

export default function PersonaDisplay({
	journey,
}: {
	journey: AugmentedJourney;
}) {
	const { classes, cx } = useStyles();
	const [viewCourses, setViewCourses] = useState<boolean>(false);

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

	const courses = filteredChapters.filter((chap) => chap.courses.length > 0);

	const guides = filteredChapters.filter((chap) => chap.guides.length > 0);

	const infoButtonDisplay = useMemo(() => courses.length !== 0, []);

	if (!filteredChapters || filteredChapters.length === 0)
		return <EmptyScreenZone>Parcours introuvable</EmptyScreenZone>;

	const currentList = viewCourses ? courses : guides;

	const chapterLinks = currentList.map((chap) => ({
		linkProps: {
			href: `#${slugify(chap.name)}`,
		},
		text: chap.name,
	}));

	return (
		<>
			{infoButtonDisplay && (
				<InfoOrCoursesButtons
					viewCourses={viewCourses}
					setViewCourses={setViewCourses}
				/>
			)}
			<div className={fr.cx("fr-container", "fr-py-4w")}>
				<h2>{`${viewCourses ? "Formations" : "Fiches pratiques"}`}</h2>
				<p className={fr.cx("fr-text--md")}>
					{`Ces ${viewCourses ? "formations" : "fiches pratiques"} vous accompagnent pour comprendre l’autisme,
					repérer les besoins de votre proche et connaître les démarches et
					soutiens existants. Les contenus sont classés par thématiques afin de
					faciliter vos recherches : santé, scolarité, vie quotidienne, droits
					et accompagnement. Vous y trouverez également des ressources concrètes
					pour vous aider au quotidien.`}
				</p>
				<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
					<SummaryContent
						className={cx(classes.whiteSummarySticky)}
						title="Chapitrages"
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
						{chapterLinks.length === 0 && (
							<div
								className={fr.cx("fr-my-2w")}
							>{`Aucune ${viewCourses ? "formation" : "fiche pratique"} trouvée`}</div>
						)}
					</div>
				</div>
			</div>
		</>
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
