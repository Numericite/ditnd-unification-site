import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { tss } from "tss-react/dsfr";
import PageContent from "~/components/ui/PageContent";
import {
	lockedMenuStore,
	menuStore,
	personStore,
	tdhStore,
} from "~/state/store";
import { personsAndProTiles } from "~/utils/pictograms";
import type { GetServerSideProps } from "next";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { SectionLink } from "~/server/pages";
import { type SitePlanEntry, buildSitePlan } from "~/utils/sitePlan";

type Props = {
	sections: Awaited<ReturnType<typeof getSitemap>>["sections"];
	rootPages: SectionLink[];
};

export default function PlanDuSite({ sections, rootPages }: Props) {
	const { classes, cx } = useStyles();

	const plan = buildSitePlan({
		lockedMenu: lockedMenuStore.get(),
		menu: menuStore.get(),
		personas: personsAndProTiles(personStore.get()),
		conditions: tdhStore.get(),
		sections: sections.map(({ section, links }) => ({
			section: { slug: section.slug, title: section.title },
			links,
		})),
		rootPages,
	});

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
						{plan.map((group, index) => (
							<section
								key={`${group.title}-${index}`}
								className={cx(classes.section)}
							>
								<h2>
									{group.href ? (
										<PlanLink entry={group} className="" />
									) : (
										group.title
									)}
								</h2>
								<PlanList entries={group.children} />
							</section>
						))}

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

function PlanLink({
	entry,
	className = fr.cx("fr-link"),
}: {
	entry: SitePlanEntry;
	className?: string;
}) {
	return entry.external ? (
		<a
			className={className}
			href={entry.href}
			target="_blank"
			rel="noopener noreferrer"
			title={`${entry.title}, nouvelle fenêtre`}
		>
			{entry.title}
		</a>
	) : (
		<a className={className} href={entry.href} title={entry.linkTitle}>
			{entry.title}
		</a>
	);
}

function PlanList({ entries }: { entries: SitePlanEntry[] }) {
	const { classes } = useStyles();
	if (entries.length === 0) return null;
	return (
		<ul className={classes.sitemapList}>
			{entries.map((entry, index) => (
				<li key={`${entry.href ?? entry.title}-${index}`}>
					{entry.href ? <PlanLink entry={entry} /> : entry.title}
					<PlanList entries={entry.children} />
				</li>
			))}
		</ul>
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
