import Head from "next/head";
import { tss } from "tss-react";
import { fr } from "@codegouvfr/react-dsfr";
import { PersonaTiles } from "~/components/HomePage/PersonaTiles";
import type { PersonaTile } from "~/components/HomePage/PersonaTiles";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import { api } from "~/utils/api";
import MostViewedGuides from "~/components/HomePage/MostViewedGuides";
import { Loader } from "~/components/ui/Loader";

export default function Home() {
	const { classes, cx } = useStyles();

	const { data: mostViewedGuides } = api.practicalGuide.getByViews.useQuery();

	if (!mostViewedGuides) return <Loader />;

	const tiles: PersonaTile[] = [
		{
			name: "Je suis une personne concernée",
			description: "Description type",
			slug: "pe",
			display: "person",
		},
		{
			name: "Je suis un parent proche",
			description: "Description type",
			slug: "pp",
			display: "person",
		},
		{
			name: "Je suis un professionnel",
			description: "Description type",
			slug: "professional",
			display: "professional",
		},
		{
			name: "Grand Public",
			description: "Description type",
			slug: "gp",
			display: "person",
		},
	];

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
							<div className={fr.cx("fr-col-12", "fr-col-lg-6")}>
								<h1>
									Plateforme nationale du TSA et des troubles du
									neuro-développement
								</h1>
								<p>
									La plateforme nationale au service des personnes concernées
									par un trouble du neurodéveloppement, les parents, et les
									professionnels.
								</p>
								<SearchBar big onButtonClick={function noRefCheck() {}} />
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
								<PersonaTiles tiles={tiles} />
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
								<h2>Fiches pratiques les plus lues</h2>
								<div className={fr.cx("fr-text--sm")}>
									Cyncentrism kontrakemi. Perlogi proaktiv. Emsocial
									transfiering. Medeltism androstik stereomodern beteendedesign.
									Realogi transdiktisk om än posttyp. Pseudotiv kontradiktisk.
									Mytofiering FAR det heteropod suprapatologi. Kvasitris
									agnostigyn absion anamatisk.
								</div>
								<MostViewedGuides guides={mostViewedGuides} />

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
