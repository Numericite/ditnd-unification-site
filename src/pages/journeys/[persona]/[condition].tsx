import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import SkipLinks from "@codegouvfr/react-dsfr/SkipLinks";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { tss } from "tss-react";
import PersonaDisplay from "~/components/PersonaPage/PersonaDisplay";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import { Loader } from "~/components/ui/Loader";
import InfoOrCoursesButtons from "~/components/ui/PersonaPage/InfoOrCoursesButtons";
import type { AugmentedJourney } from "~/server/api/routers/journeys";
import { api } from "~/utils/api";

export default function JourneyPage() {
	const { classes, cx } = useStyles();

	const [viewCourses, setViewCourses] = useState<boolean>(false);
	const router = useRouter();
	const persona = router.query.persona as string;
	const condition = router.query.condition as string;

	const { data: journeyData, isLoading: isLoadingJourney } =
		api.journey.getByPersona.useQuery({
			persona: persona,
		});

	if (isLoadingJourney) return <Loader />;

	if (!journeyData || journeyData.length === 0) {
		return <EmptyScreenZone>Parcours introuvable</EmptyScreenZone>;
	}

	const journey = journeyData[0] as AugmentedJourney;

	return (
		<>
			<Head>
				<title>DITND - {journey.journey_name}</title>
			</Head>
			<SkipLinks
				links={[
					{
						anchor: "#summary",
						label: "Sommaire",
					},

					{
						anchor: "#search",
						label: "Recherche",
					},
					{
						anchor: "#contenu",
						label: "Contenu",
					},
					{
						anchor: "#footer",
						label: "Pied de page",
					},
				]}
			/>
			<div className={fr.cx("fr-container")}>
				<Breadcrumb
					currentPageLabel={`Je suis un ${journey.persona.name.toLowerCase()} interessé par le ${condition.toUpperCase()}`}
					homeLinkProps={{
						href: "/",
					}}
					segments={[]}
				/>
			</div>
			<div className={fr.cx("fr-container")}>
				<div className={fr.cx("fr-py-4w")}>
					<div
						className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}
						style={{ alignItems: "stretch" }}
					>
						<div
							className={fr.cx("fr-col-12", "fr-col-lg-6")}
							style={{ alignContent: "center" }}
						>
							<h1>{`Je suis un ${journey.persona.name.toLowerCase()} interessé par le ${condition.toUpperCase()}`}</h1>
							<p>
								Le TSA, ou trouble du spectre de l’autisme, est un trouble du
								neurodéveloppement qui se manifeste dès l’enfance et qui
								accompagne la personne tout au long de sa vie. Il se caractérise
								principalement par des difficultés dans la communication et les
								interactions sociales, ainsi que par des comportements et
								intérêts restreints et répétitifs.
							</p>
						</div>
						<div className={fr.cx("fr-col-12", "fr-col-lg-6")}>
							<img
								className={fr.cx("fr-responsive-img")}
								alt=""
								src={
									journey.image?.url ??
									"https://www.systeme-de-design.gouv.fr/v1.14/storybook/img/placeholder.16x9.png"
								}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className={cx(classes.coloredContainer)}>
				<InfoOrCoursesButtons
					viewCourses={viewCourses}
					setViewCourses={setViewCourses}
				/>
				<div className={fr.cx("fr-container", "fr-py-4w")}>
					<h2>Fiches pratiques</h2>
					<p className={fr.cx("fr-text--md")}>
						Ces fiches pratiques vous accompagnent pour comprendre l’autisme,
						repérer les besoins de votre proche et connaître les démarches et
						soutiens existants. Les contenus sont classés par thématiques afin
						de faciliter vos recherches : santé, scolarité, vie quotidienne,
						droits et accompagnement. Vous y trouverez également des ressources
						concrètes pour vous aider au quotidien.
					</p>
					<PersonaDisplay journey={journey} viewCourses={viewCourses} />
				</div>
			</div>
		</>
	);
}

const useStyles = tss.withName(JourneyPage.name).create({
	coloredContainer: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
	},
	summarySticky: {
		position: "sticky",
		top: "20px",
		".fr-summary__link:before": {
			visibility: "hidden",
		},
	},
	centeredContainer: {
		textAlign: "center",
		paddingTop: fr.spacing("4w"),
	},
});
