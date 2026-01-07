import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { tss } from "tss-react";
import sanitizeHtml from "sanitize-html";
import { Loader } from "~/components/ui/Loader";
import { PracticalGuide } from "~/components/ui/PracticalGuides/PracticalGuide";
import ShareSocials from "~/components/ui/PracticalGuides/ShareSocials";
import { addAnchors } from "~/components/utils/addAnchor";
import GuideSummary from "~/components/ui/PracticalGuides/GuideSummary";

export default function PracticalGuidePage() {
	const router = useRouter();
	const slug = router.query.slug as string;
	const { classes, cx } = useStyles();

	const { data: guideData } = api.practicalGuide.getBySlug.useQuery({
		slug: slug,
	});

	if (!guideData || guideData.length === 0) {
		return <div>Fiche introuvable</div>;
	}

	const guide = guideData[0];

	return (
		<>
			{!guide ? (
				<Loader />
			) : (
				<div>
					<Head>
						<title>DITND - {guide.title}</title>
					</Head>
					<Breadcrumb
						currentPageLabel={guide.title}
						homeLinkProps={{
							href: "/",
						}}
						segments={[
							{
								label: "Fiches Pratiques",
								linkProps: {
									href: "/guides",
								},
							},
						]}
					/>
					<div className={fr.cx("fr-grid-row")}>
						<GuideSummary html={guide.html} />
						<div className={fr.cx("fr-col-12", "fr-col-lg-9")}>
							<h4>Fiches pratiques</h4>
							<div
								className={cx(classes.wysiwig)}
								dangerouslySetInnerHTML={{
									__html: addAnchors(sanitizeHtml(guide.html)),
								}}
							></div>
							<div className={cx(classes.footerContent)}>
								<div className={fr.cx("fr-mt-2w")}>
									<p className={fr.cx("fr-text--md")}>Partager la page</p>
									<ShareSocials />
								</div>
							</div>
							<div className={cx(classes.footerContent)}>
								{guide["practical-guides"]?.length !== 0 && (
									<div className={fr.cx("fr-mt-2w")}>
										<h5 id="fiches-pratiques">
											Ces fiches pratiques qui pourraient vous intéresser{" "}
										</h5>
										<div
											className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}
										>
											{guide["practical-guides"]?.map((g, index) => {
												if (typeof g === "number") {
													return undefined;
												}
												const condition0 = g.conditions?.[0];
												const theme0 = g.theme?.[0];

												const populatedCondition =
													typeof condition0 === "number"
														? undefined
														: condition0;

												const populatedTheme =
													typeof theme0 === "number" ? undefined : theme0;

												return (
													<div
														key={`guide${index}`}
														className={fr.cx("fr-col-12", "fr-col-sm-6")}
														style={{ display: "flex" }}
													>
														<PracticalGuide
															key={g.slug}
															title={g.title}
															slug={g.slug}
															badge={populatedTheme?.name}
															description={g.description}
															condition={populatedCondition?.slug}
															textColor={populatedCondition?.textColor}
															backgroundColor={
																populatedCondition?.backgroundColor
															}
														/>
													</div>
												);
											})}
										</div>
									</div>
								)}
								<div className={fr.cx("fr-mt-2w")}>
									<h5 id="formations">
										Ces formations qui pourraient vous intéresser{" "}
									</h5>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

const useStyles = tss.withName(PracticalGuidePage.name).create(() => ({
	footerContent: {
		borderTop: "2px solid var(--border-default-grey)",
		marginBottom: fr.spacing("3w"),
	},
	wysiwig: {
		"h1,h2,h3": {
			color: fr.colors.decisions.text.active.blueFrance.default,
		},
		ul: {
			paddingInlineStart: "2.5rem",
			"li:has(ul)": {
				listStyle: "none",
			},
			ul: {
				li: {
					listStyleType: "circle",
				},
			},
		},
		a: {
			color: fr.colors.decisions.background.actionHigh.blueFrance.hover,
		},
	},
}));
