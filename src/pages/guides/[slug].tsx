import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import { Summary } from "@codegouvfr/react-dsfr/Summary";

import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { tss } from "tss-react";
import Button from "@codegouvfr/react-dsfr/Button";
import type { FrIconClassName } from "@codegouvfr/react-dsfr/fr/generatedFromCss/classNames";
import sanitizeHtml from "sanitize-html";
import generateSummary, { slugify } from "~/components/utils/generateSummary";
import { Loader } from "~/components/ui/Loader";

type SocialProps = {
	icon: FrIconClassName;
	onClick: () => void;
	title: string;
};

const socials: SocialProps[] = [
	{
		icon: "fr-icon-facebook-circle-line",
		onClick: () => {},
		title: "Lien Facebook",
	},
	{
		icon: "fr-icon-twitter-x-line",
		onClick: () => {},
		title: "Lien X",
	},
	{
		icon: "fr-icon-linkedin-box-line",
		onClick: () => {},
		title: "Lien LinkedIn",
	},
	{
		icon: "fr-icon-mail-line",
		onClick: () => {
			location.href = "mailto:";
		},
		title: "Lien Outlook",
	},
	{
		icon: "fr-icon-links-line",
		onClick: () => {
			navigator.clipboard.writeText(location.href.replace(/#.*$/, ""));
			alert("Adresse copié dans le presse papier");
		},
		title: "Copier le lien",
	},
];

export function addAnchors(html: string) {
	return html.replace(/<h5([^>]*)>(.*?)<\/h5>/gi, (_, attrs, title) => {
		const id = slugify(title);
		return `<h5${attrs} id="${id}">${title}</h5>`;
	});
}

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
				<div style={{ scrollBehavior: "smooth" }}>
					<Head>
						<title>DITND - {guide.title}</title>
					</Head>
					<Breadcrumb
						currentPageLabel={guideData[0]?.title}
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
						<div
							className={fr.cx(
								"fr-pr-3v",
								"fr-col-lg-3",
								"fr-col-sm-12",
								"fr-mb-2w",
							)}
						>
							<Summary
								className={cx(classes.summarySticky)}
								links={generateSummary(guide.html).map((link) => ({
									linkProps: link.linkProps,
									text: link.text,
								}))}
								title="Sommaire"
							/>
						</div>
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
									{socials.map((social, index) => (
										<Button
											key={index}
											iconId={social.icon}
											onClick={social.onClick}
											priority="tertiary"
											title={social.title}
										/>
									))}
								</div>
							</div>
							<div className={cx(classes.footerContent)}>
								<div className={fr.cx("fr-mt-2w")}>
									<h5 id="fiches-pratiques">
										Ces fiches pratiques qui pourraient vous intéresser{" "}
									</h5>
								</div>
								<div className={fr.cx("fr-mt-2w")}>
									<h5 id="formations">
										Ces fiches formations qui pourraient vous intéresser{" "}
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
	summarySticky: {
		position: "sticky",
		top: "20px",
		".fr-summary__link:before": {
			visibility: "hidden",
		},
	},
	footerContent: {
		borderTop: "2px solid var(--border-default-grey)",
		marginBottom: fr.spacing("3w"),
	},
	wysiwig: {
		h3: {
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
