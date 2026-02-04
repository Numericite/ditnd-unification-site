import Head from "next/head";
import { tss } from "tss-react";
import { fr } from "@codegouvfr/react-dsfr";
import { PersonaTiles } from "~/components/HomePage/PersonaTiles";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import { api } from "~/utils/api";
import MostViewedGuides from "~/components/HomePage/MostViewedGuides";
import { Loader } from "~/components/ui/Loader";
import Avatar from "@codegouvfr/react-dsfr/picto/Avatar";
import HumanCooperation from "@codegouvfr/react-dsfr/picto/HumanCooperation";
import CityHall from "@codegouvfr/react-dsfr/picto/CityHall";
import SelfTraining from "@codegouvfr/react-dsfr/picto/SelfTraining";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import SkipLinks from "@codegouvfr/react-dsfr/SkipLinks";
import { homeCMSStore, personStore } from "~/state/store";

export const pictogramMap = {
	Avatar,
	HumanCooperation,
	CityHall,
	SelfTraining,
};

export type PictogramName = keyof typeof pictogramMap;

export default function Home() {
	const { classes, cx } = useStyles();

	const [search, setSearch] = useState("");

	const router = useRouter();

	const { data: mostViewedGuides, isLoading: isLoadingViewedGuides } =
		api.practicalGuide.getByViews.useQuery();

	const persons = personStore.get();

	const homeCMS = homeCMSStore.get();

	if (isLoadingViewedGuides || !persons) return <Loader />;

	if (!homeCMS)
		return (
			<EmptyScreenZone>
				<p>
					Erreur lors du chargement des variables globales sur payload CMS,
					veuillez revoir la configuration de votre instance Payload.{" "}
				</p>
			</EmptyScreenZone>
		);

	return (
		<>
			<Head>
				<title>DITND - Accueil</title>
			</Head>
			<SkipLinks
				links={[
					{
						anchor: "#search-global",
						label: "Recherche",
					},
					{
						anchor: "#who",
						label: "Qui êtes vous",
					},
					{
						anchor: "#mostViewed",
						label: "Fiches Pratiques les plus lues",
					},

					{
						anchor: "#footer",
						label: "Pied de page",
					},
				]}
			/>
			<div className={fr.cx("fr-container")}>
				<Breadcrumb
					currentPageLabel=""
					homeLinkProps={{
						href: "/",
					}}
					segments={[]}
				/>
			</div>
			<div>
				<div className={fr.cx("fr-container")}>
					<div className={fr.cx("fr-py-4w")}>
						<div
							className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}
							style={{ alignContent: "center" }}
						>
							<div className={fr.cx("fr-col-12", "fr-col-md-6")}>
								<h1>{homeCMS.header.title}</h1>
								<p>{homeCMS.header.description}</p>
								<SearchBar
									id="search-global"
									big
									onButtonClick={() => router.push(`/guides?search=${search}`)}
									renderInput={({ className, id, placeholder, type }) => (
										<input
											className={className}
											id={id}
											placeholder={placeholder}
											type={type}
											value={search}
											onChange={(event) => {
												if (event.currentTarget.value === "") setSearch("");
												setSearch(event.currentTarget.value);
											}}
										/>
									)}
								/>
							</div>
							<div
								className={fr.cx("fr-col-12", "fr-col-md-6")}
								style={{
									display: "flex",
									justifyContent: "center",
								}}
							>
								<Image
									alt=""
									width={400}
									height={400}
									src={"/HomePageIllustration.svg"}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className={cx(classes.coloredContainer)} id="who">
					<div className={fr.cx("fr-container")}>
						<div className={fr.cx("fr-py-6w")}>
							<div className={fr.cx("fr-grid-row")}>
								{persons ? (
									<PersonaTiles
										tiles={[
											...persons.map((persona) => ({
												...persona,
												name: `Je suis ${persona.name}`,
											})),
											{
												name: "Je suis un professionnel",
												description: "Description type",
												slug: "professional",
												display: "professional",
												pictogram: "CityHall",
											},
										]}
									/>
								) : (
									"Aucun persona trouvé"
								)}
							</div>
						</div>
					</div>
				</div>
				<div className={fr.cx("fr-container")}>
					<div className={fr.cx("fr-py-4w")}>
						<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
							<div
								className={cx(fr.cx("fr-col-12"), classes.mostViewedContainer)}
								id="mostViewed"
							>
								<h2>{homeCMS?.mostViewedGuides.title}</h2>
								<div className={fr.cx("fr-text--sm")}>
									{homeCMS?.mostViewedGuides.description}
								</div>

								{mostViewedGuides?.length === 0 || !mostViewedGuides ? (
									<div>Aucune fiche pratique trouvée</div>
								) : (
									<MostViewedGuides guides={mostViewedGuides} />
								)}

								<a
									href="/guides"
									className={cx(
										fr.cx(
											"fr-link",
											"fr-icon-arrow-right-line",
											"fr-link--icon-right",
										),
										classes.viewMoreLink,
									)}
								>
									Voir toutes les fiches par thématiques
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

const useStyles = tss.withName(Home.name).create({
	coloredContainer: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
	},
	mostViewedContainer: {
		display: "flex",
		flexDirection: "column",
	},
	viewMoreLink: {
		marginLeft: "auto",
		marginTop: fr.spacing("2w"),
	},
});
