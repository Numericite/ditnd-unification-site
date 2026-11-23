import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import { tss } from "tss-react/dsfr";
import PageContent from "~/components/ui/PageContent";
import SeoMeta from "~/components/ui/SeoMeta";
import type { PageSection } from "~/payload/payload-types";
import type { SectionLink } from "~/server/pages";
import { sectionPath } from "~/utils/pages";

type Props = {
	section: PageSection;
	links: SectionLink[];
};

export default function SectionView({ section, links }: Props) {
	const { classes, cx } = useStyles();

	return (
		<>
			<SeoMeta
				title={section.title}
				description={section.description?.trim() || ""}
				pathname={sectionPath(section.slug)}
			/>
			<div className={fr.cx("fr-container", "fr-pb-10v")}>
				<Breadcrumb
					currentPageLabel={section.title}
					homeLinkProps={{ href: "/" }}
					segments={[]}
				/>
				<PageContent>
					<h1>{section.title}</h1>

					<nav aria-label={section.title}>
						<ul className={cx(classes.list)}>
							{links.map((link) => (
								<li key={link.href}>
									<a className={fr.cx("fr-link")} href={link.href}>
										{link.title}
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

const useStyles = tss.withName({ SectionView }).create({
	list: {
		listStyle: "none",
		paddingLeft: fr.spacing("3w"),
		"& > li": {
			paddingTop: fr.spacing("1v"),
			paddingBottom: fr.spacing("1v"),
		},
	},
});
