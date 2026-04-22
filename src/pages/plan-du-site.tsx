import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { tss } from "tss-react/dsfr";
import { personStore } from "~/state/store";
import { personsAndProTiles } from "~/utils/tools";

export default function PlanDuSite() {
	const { classes, cx } = useStyles();

	const personas = personsAndProTiles(personStore.get());

	return (
		<>
			<Head>
				<title>Plan du site - Maison de l'autisme</title>
				<meta
					name="description"
					content="Plan du site de la Maison de l'autisme : retrouvez l'ensemble des pages et rubriques du site national d'informations sur l'autisme et les troubles du neurodéveloppement."
				/>
			</Head>
			<div className={fr.cx("fr-container", "fr-pb-10v")}>
				<Breadcrumb
					currentPageLabel="Plan du site"
					homeLinkProps={{ href: "/" }}
					segments={[]}
				/>
				<h1>Plan du site</h1>

				<nav aria-label="Plan du site">
					<section className={cx(classes.section)}>
						<h2>Accueil</h2>
						<ul className={cx(classes.sitemapList)}>
							<li>
								<a className={fr.cx("fr-link")} href="/">
									Page d'accueil
								</a>
							</li>
						</ul>
					</section>

					<section className={cx(classes.section)}>
						<h2>Mon parcours</h2>
						<p className={fr.cx("fr-text--sm", "fr-mb-2w")}>
							Trouvez les ressources adaptées à votre profil
						</p>
						{personas.length > 0 && (
							<ul className={cx(classes.sitemapList)}>
								{personas.map((persona) => (
									<li key={persona.slug}>
										<a
											className={fr.cx("fr-link")}
											href={`/parcours/${persona.slug}`}
										>
											{persona.name}
										</a>
									</li>
								))}
							</ul>
						)}
					</section>

					<section className={cx(classes.section)}>
						<h2>S'informer</h2>
						<p className={fr.cx("fr-text--sm", "fr-mb-2w")}>
							Ressources et informations sur l'autisme et les troubles du
							neurodéveloppement
						</p>
						<ul className={cx(classes.sitemapList)}>
							<li>
								<a className={fr.cx("fr-link")} href="/fiches-pratiques">
									Fiches pratiques
								</a>
							</li>
							<li>
								<a className={fr.cx("fr-link")} href="/formations">
									Formations
								</a>
							</li>
						</ul>
					</section>

					<section className={cx(classes.section)}>
						<h2>À propos</h2>
						<ul className={cx(classes.sitemapList)}>
							<li>
								<a
									className={fr.cx("fr-link")}
									href="/a-propos/maison-de-l-autisme"
								>
									Maison de l'autisme
								</a>
							</li>
							<li>
								<a className={fr.cx("fr-link")} href="/a-propos/gncra">
									GNCRA
								</a>
							</li>
							<li>
								<a className={fr.cx("fr-link")} href="/a-propos/cras">
									CRAs
								</a>
							</li>
						</ul>
					</section>

					<section className={cx(classes.section)}>
						<h2>Informations et obligations légales</h2>
						<ul className={cx(classes.sitemapList)}>
							<li>
								<a className={fr.cx("fr-link")} href="/accessibilite">
									Accessibilité
								</a>
							</li>
							<li>
								<a className={fr.cx("fr-link")} href="/mentions-legales">
									Mentions légales
								</a>
							</li>
							<li>
								<a className={fr.cx("fr-link")} href="/donnees-personnelles">
									Données personnelles
								</a>
							</li>
							<li>
								<a className={fr.cx("fr-link")} href="/modalites-utilisation">
									Modalités d'utilisation
								</a>
							</li>
							<li>
								<a className={fr.cx("fr-link")} href="/contact-pros-cra">
									Contact professionnels
								</a>
							</li>
						</ul>
					</section>
				</nav>
			</div>
		</>
	);
}

const useStyles = tss.withName(PlanDuSite.name).create({
	section: {
		marginBottom: fr.spacing("4w"),
		paddingBottom: fr.spacing("4w"),
		borderBottom: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		"&:last-child": {
			borderBottom: "none",
		},
		"& h2": {
			marginBottom: fr.spacing("1w"),
		},
	},
	sitemapList: {
		listStyle: "none",
		paddingLeft: fr.spacing("3w"),
		"& > li": {
			paddingTop: fr.spacing("1v"),
			paddingBottom: fr.spacing("1v"),
		},
	},
});
