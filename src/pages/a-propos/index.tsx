import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { tss } from "tss-react/dsfr";
import PageContent from "~/components/ui/PageContent";

const aboutLinks = [
	{ href: "/a-propos/maison-de-l-autisme", label: "Maison de l'autisme" },
	{ href: "/a-propos/gncra", label: "GNCRA" },
	{ href: "/a-propos/cras", label: "CRAs" },
];

export default function AProposIndex() {
	const { classes, cx } = useStyles();

	return (
		<>
			<Head>
				<title>À propos - Maison de l'autisme</title>
				<meta
					name="description"
					content="À propos de la Maison de l'autisme : découvrez la Maison de l'autisme, le GNCRA et les Centres Ressources Autisme."
				/>
			</Head>
			<div className={fr.cx("fr-container", "fr-pb-10v")}>
				<Breadcrumb
					currentPageLabel="À propos"
					homeLinkProps={{ href: "/" }}
					segments={[]}
				/>
				<PageContent>
					<h1>À propos</h1>

					<nav aria-label="À propos">
						<ul className={cx(classes.sitemapList)}>
							{aboutLinks.map((link) => (
								<li key={link.href}>
									<a className={fr.cx("fr-link")} href={link.href}>
										{link.label}
									</a>
								</li>
							))}
						</ul>
					</nav>
				</PageContent>
			</div>
		</>
	);
}

const useStyles = tss.withName(AProposIndex.name).create({
	sitemapList: {
		listStyle: "none",
		paddingLeft: fr.spacing("3w"),
		"& > li": {
			paddingTop: fr.spacing("1v"),
			paddingBottom: fr.spacing("1v"),
		},
	},
});
