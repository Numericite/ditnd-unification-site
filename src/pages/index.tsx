import Head from "next/head";
import { tss } from "tss-react";
import { fr } from "@codegouvfr/react-dsfr";
import {
	PersonaTiles,
	type PersonaTile,
} from "~/components/HomePage/PersonaTiles";
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

export const personas: PersonaTile[] = [
	{
		name: "Je suis une personne concernée",
		description: "Description type",
		slug: "pe",
		display: "person",
		pictogram: <Avatar />,
	},
	{
		name: "Je suis un parent ou un proche",
		description: "Description type",
		slug: "pp",
		display: "person",
		pictogram: <HumanCooperation />,
	},
	{
		name: "Je suis un professionnel",
		description: "Description type",
		slug: "professional",
		display: "professional",
		pictogram: <CityHall />,
	},
	{
		name: "Grand Public",
		description: "Description type",
		slug: "gp",
		display: "person",
		pictogram: <SelfTraining />,
	},
];

export default function Home() {
	const { classes, cx } = useStyles();

	const [search, setSearch] = useState("");

	const router = useRouter();

	const { data: homeCMS, isLoading: isLoadingHomeCMS } =
		api.cms.home.useQuery();

	const { data: mostViewedGuides, isLoading: isLoadingViewedGuides } =
		api.practicalGuide.getByViews.useQuery();

	if (isLoadingViewedGuides || isLoadingHomeCMS) return <Loader />;

	if (!homeCMS)
		return (
			<EmptyScreenZone>
				<p>
					Error loading globals with payload CMS please review your payload
					database's globals
				</p>
			</EmptyScreenZone>
		);

	return (
		<>
			<Head>
				<title>DITND - Accueil</title>
			</Head>
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
				<div className={cx(classes.coloredContainer)}>
					<div className={fr.cx("fr-container")}>
						<div className={fr.cx("fr-py-6w")}>
							<div className={fr.cx("fr-grid-row")}>
								<div className={fr.cx("fr-col-12")}>
									<h2>Qui êtes vous</h2>
									<div className={fr.cx("fr-text--sm")}>
										Cyncentrism kontrakemi. Perlogi proaktiv. Emsocial
										transfiering. Medeltism androstik stereomodern
										beteendedesign. Realogi transdiktisk om än posttyp.
										Pseudotiv kontradiktisk. Mytofiering FAR det heteropod
										suprapatologi. Kvasitris agnostigyn absion anamatisk.
									</div>
								</div>
								<PersonaTiles tiles={personas} />
							</div>
						</div>
					</div>
				</div>
				<div className={fr.cx("fr-container")}>
					<div className={fr.cx("fr-py-4w")}>
						<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
							<div
								className={cx(fr.cx("fr-col-12"), classes.mostViewedContainer)}
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
