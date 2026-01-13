import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { useRouter } from "next/router";
import { tss } from "tss-react";
import PersonaDisplay from "~/components/PersonaPage/PersonaDisplay";
import { Loader } from "~/components/ui/Loader";
import type { AugmentedJourney } from "~/server/api/routers/journeys";
import { api } from "~/utils/api";

export default function JourneyPage() {
	const { classes, cx } = useStyles();

	const router = useRouter();
	const persona = router.query.persona as string;

	const { data: journeyData, isLoading: isLoadingJourney } =
		api.journey.getByPersona.useQuery({
			persona: persona,
		});

	if (isLoadingJourney && !journeyData) return <Loader />;

	if (!journeyData || journeyData.length === 0) {
		return <div>Parcours introuvable</div>;
	}

	const journey = journeyData[0] as AugmentedJourney;

	return (
		<div className="">
			<div className={fr.cx("fr-container")}>
				<Breadcrumb
					currentPageLabel={journey.journey_name}
					homeLinkProps={{
						href: "/",
					}}
					segments={[]}
				/>
				<Head>
					<title>DITND - {journey.journey_name}</title>
				</Head>
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
							<h1>{journey.journey_name}</h1>
							<p>
								L’autisme, ou trouble du spectre de l’autisme (TSA), est un
								trouble du neurodéveloppement qui se manifeste dès l’enfance et
								qui accompagne la personne tout au long de sa vie. Il se
								caractérise principalement par des difficultés dans la
								communication et les interactions sociales, ainsi que par des
								comportements et intérêts restreints et répétitifs.
							</p>
						</div>
						<div className={fr.cx("fr-col-12", "fr-col-lg-6")}>
							<img
								className={fr.cx("fr-responsive-img")}
								alt=""
								src={
									"https://www.systeme-de-design.gouv.fr/v1.14/storybook/img/placeholder.16x9.png"
								}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className={cx(classes.coloredContainer)}>
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
					<PersonaDisplay journey={journey} />
				</div>
			</div>
		</div>
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
});
