import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { tss } from "tss-react/dsfr";
import PageContent from "~/components/ui/PageContent";
import { personStore, tdhStore } from "~/state/store";
import { personsAndProTiles } from "~/utils/pictograms";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { SectionLink } from "~/server/pages";
import { sectionPath } from "~/utils/pages";

type Props = {
	sections: Awaited<ReturnType<typeof getSitemap>>["sections"];
	rootPages: SectionLink[];
};

export default function PlanDuSite({ sections, rootPages }: Props) {
	const { classes, cx } = useStyles();

	const personas = personsAndProTiles(personStore.get());
	const conditions = tdhStore.get();

	return (
		<>
			<Head>
				<title>Plan du site - Maison de l'autisme</title>
				<meta
					name="description"
					content="Plan du site de la Maison de l'autisme : retrouvez l'ensemble des pages et rubriques du site national d'informations sur l'autisme et ses troubles associés."
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
																href={`/parcours/${persona.slug}/${condition.slug.toLowerCase()}`}
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
								Ressources et informations sur l'autisme et ses troubles
								associés
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
								<li>
									<a className={fr.cx("fr-link")} href="/glossaire">
										Glossaire
									</a>
								</li>
							</ul>
						</section>

						{sections.map(({ section, links }) => (
							<section key={section.id} className={cx(classes.section)}>
								<h2>
									<a href={sectionPath(section.slug)}>{section.title}</a>
								</h2>
								{links.length > 0 && (
									<ul className={cx(classes.sitemapList)}>
										{links.map((link) => (
											<li key={link.href}>
												<a className={fr.cx("fr-link")} href={link.href}>
													{link.title}
												</a>
											</li>
										))}
									</ul>
								)}
							</section>
						))}

						{rootPages.length > 0 && (
							<section className={cx(classes.section)}>
								<h2>Autres pages</h2>
								<ul className={cx(classes.sitemapList)}>
									{rootPages.map((link) => (
										<li key={link.href}>
											<a className={fr.cx("fr-link")} href={link.href}>
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</section>
						)}

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
							</ul>
						</section>
					</nav>
				</PageContent>
			</div>
		</>
	);
}

const getSitemap = async () => {
	const caller = createCaller(await createTRPCContext());
	const [sections, rootPages] = await Promise.all([
		caller.page.listSections(),
		caller.page.listRootPages(),
	]);
	return { sections, rootPages };
};

export const getServerSideProps: GetServerSideProps<Props> = async () => ({
	props: await getSitemap(),
});

const useStyles = tss.withName({ PlanDuSite }).create({
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
