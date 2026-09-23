import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import config from "@payload-config";
import { getPayload } from "payload";
import { tss } from "tss-react/dsfr";
import PageContent from "~/components/ui/PageContent";
import { personStore, tdhStore } from "~/state/store";
import { personsAndProTiles } from "~/utils/pictograms";

type SitemapEntry = { slug: string; title: string };

type Props = {
	practicalGuides: SitemapEntry[];
	courses: SitemapEntry[];
};

export default function PlanDuSite({ practicalGuides, courses }: Props) {
	const { classes, cx } = useStyles();

	const personas = personsAndProTiles(personStore.get());
	const conditions = tdhStore.get();

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
				<PageContent>
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
											{conditions && conditions.length > 0 && (
												<ul className={cx(classes.sitemapList)}>
													{conditions.map((condition) => (
														<li key={`${persona.slug}-${condition.slug}`}>
															<a
																className={fr.cx("fr-link")}
																href={`/parcours/${persona.slug}/${condition.slug}`}
																title={`${persona.name} par le ${condition.acronym || condition.name}`}
															>
																par le {condition.acronym || condition.name}
															</a>
														</li>
													))}
												</ul>
											)}
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
									{practicalGuides.length > 0 && (
										<ul className={cx(classes.sitemapList)}>
											{practicalGuides.map((guide) => (
												<li key={guide.slug}>
													<a
														className={fr.cx("fr-link")}
														href={`/fiches-pratiques/${guide.slug}`}
													>
														{guide.title}
													</a>
												</li>
											))}
										</ul>
									)}
								</li>
								<li>
									<a className={fr.cx("fr-link")} href="/formations">
										Formations
									</a>
									{courses.length > 0 && (
										<ul className={cx(classes.sitemapList)}>
											{courses.map((course) => (
												<li key={course.slug}>
													<a
														className={fr.cx("fr-link")}
														href={`/formations/${course.slug}`}
													>
														{course.title}
													</a>
												</li>
											))}
										</ul>
									)}
								</li>
								<li>
									<a className={fr.cx("fr-link")} href="/cartographie">
										Cartographie
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
									<a className={fr.cx("fr-link")} href="/a-propos/cra">
										CRA
									</a>
								</li>
								<li>
									<a className={fr.cx("fr-link")} href="/a-propos/glossaire">
										Glossaire
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
									<a className={fr.cx("fr-link")} href="/contact-particuliers">
										Contact particuliers
									</a>
								</li>
								<li>
									<a className={fr.cx("fr-link")} href="/contact-pros-cra">
										Contact professionnels
									</a>
								</li>
								<li>
									<a className={fr.cx("fr-link")} href="/gestion-des-cookies">
										Gestion des cookies
									</a>
								</li>
							</ul>
						</section>
					</nav>
				</PageContent>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const payload = await getPayload({ config });

	const [guides, courses] = await Promise.all([
		payload.find({
			collection: "practical-guides",
			where: { _status: { equals: "published" } },
			limit: 1000,
			pagination: false,
			select: { slug: true, title: true },
		}),
		payload.find({
			collection: "courses",
			limit: 1000,
			pagination: false,
			select: { slug: true, title: true },
		}),
	]);

	const toEntries = (
		docs: Array<{ slug?: string | null; title?: string | null }>,
	) =>
		docs
			.flatMap((doc) =>
				doc.slug && doc.title ? [{ slug: doc.slug, title: doc.title }] : [],
			)
			.sort((a, b) => a.title.localeCompare(b.title, "fr"));

	return {
		props: {
			practicalGuides: toEntries(guides.docs),
			courses: toEntries(courses.docs),
		},
	};
};

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
