import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Button from "@codegouvfr/react-dsfr/Button";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useId } from "react";
import { getPayload } from "payload";
import { tss } from "tss-react/dsfr";
import PlatformCard from "~/components/Courses/PlatformCard";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import PageContent from "~/components/ui/PageContent";
import type { CoursesPage, Media } from "~/payload/payload-types";
import payloadConfig from "~/payload/payload.config";

type Props = {
	coursesPage: Pick<CoursesPage, "header" | "platforms" | "selection"> | null;
};

export default function SeFormer({ coursesPage }: Props) {
	const { classes, cx } = useStyles();
	const platformsTitleId = useId();
	const selectionTitleId = useId();

	if (!coursesPage) return <EmptyScreenZone>Contenu manquant</EmptyScreenZone>;

	const { header, platforms, selection } = coursesPage;
	const headerImage =
		typeof header.image === "object" ? (header.image as Media | null) : null;
	const { label: secondaryLabel, url: secondaryUrl } =
		header.secondaryLink ?? {};
	const { label: selectionLinkLabel, url: selectionLinkUrl } =
		selection.link ?? {};

	return (
		<>
			<Head>
				<title>Me former - Maison de l'autisme</title>
				<meta name="description" content={header.description} />
			</Head>
			<PageContent>
				<div className={fr.cx("fr-container", "fr-pb-8w")}>
					<Breadcrumb
						currentPageLabel="Me former"
						homeLinkProps={{ href: "/" }}
						segments={[]}
					/>
					<div
						className={fr.cx(
							"fr-grid-row",
							"fr-grid-row--gutters",
							"fr-grid-row--middle",
						)}
					>
						<div
							className={fr.cx(
								"fr-col-12",
								headerImage?.url ? "fr-col-md-6" : "fr-col-md-8",
							)}
						>
							<h1 className={fr.cx("fr-mb-3w")}>{header.title}</h1>
							<p
								className={cx(
									fr.cx("fr-text--lg", "fr-mb-4w"),
									classes.preLine,
								)}
							>
								{header.description}
							</p>
							<ButtonsGroup
								inlineLayoutWhen="sm and up"
								buttons={[
									{
										children: header.primaryLink.label,
										linkProps: { href: header.primaryLink.url },
									},
									...(secondaryLabel && secondaryUrl
										? [
												{
													children: secondaryLabel,
													priority: "secondary" as const,
													linkProps: { href: secondaryUrl },
												},
											]
										: []),
								]}
							/>
						</div>
						{headerImage?.url && (
							<div className={fr.cx("fr-col-12", "fr-col-md-6")}>
								<img
									className={classes.headerImage}
									src={headerImage.url}
									alt={headerImage.alt ?? ""}
								/>
							</div>
						)}
					</div>
				</div>
				<section
					aria-labelledby={platformsTitleId}
					className={fr.cx("fr-container", "fr-pb-8w")}
				>
					<h2 id={platformsTitleId} className={fr.cx("fr-h3", "fr-mb-2w")}>
						{platforms.title}
					</h2>
					<p className={cx(fr.cx("fr-mb-4w"), classes.preLine)}>
						{platforms.description}
					</p>
					<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
						<div className={fr.cx("fr-col-12")}>
							<PlatformCard platform={platforms.featured} variant="featured" />
						</div>
						<div className={fr.cx("fr-col-12", "fr-col-md-6")}>
							<PlatformCard platform={platforms.left} variant="half" />
						</div>
						<div className={fr.cx("fr-col-12", "fr-col-md-6")}>
							<PlatformCard platform={platforms.right} variant="half" />
						</div>
					</div>
				</section>
				<section
					aria-labelledby={selectionTitleId}
					className={classes.coloredContainer}
				>
					<div className={fr.cx("fr-container", "fr-py-8w")}>
						<h2 id={selectionTitleId} className={fr.cx("fr-mb-2w")}>
							{selection.title}
						</h2>
						<p className={cx(fr.cx("fr-mb-4w"), classes.preLine)}>
							{selection.description}
						</p>
						{/** biome-ignore lint/a11y/useSemanticElements: l'élément est déjà un <ol>, voir role ci-dessous */}
						<ol
							// biome-ignore lint/a11y/noRedundantRoles: Safari/VoiceOver retire la sémantique de liste quand list-style vaut none
							role="list"
							className={cx(
								fr.cx("fr-grid-row", "fr-grid-row--gutters"),
								classes.steps,
							)}
						>
							{selection.steps.map((step, index) => (
								<li
									key={step.id ?? index}
									className={fr.cx("fr-col-12", "fr-col-md-4")}
								>
									<div className={classes.step}>
										<p className={classes.stepNumber} aria-hidden="true">
											{index + 1}
										</p>
										<h3 className={fr.cx("fr-h5")}>
											<span className={fr.cx("fr-sr-only")}>
												Étape {index + 1} :{" "}
											</span>
											{step.title}
										</h3>
										<p className={classes.preLine}>{step.description}</p>
									</div>
								</li>
							))}
						</ol>
						{selectionLinkLabel && selectionLinkUrl && (
							<div className={classes.buttonContainer}>
								<Button linkProps={{ href: selectionLinkUrl }}>
									{selectionLinkLabel}
								</Button>
							</div>
						)}
					</div>
				</section>
			</PageContent>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const payload = await getPayload({ config: payloadConfig });
	const { header, platforms, selection } = await payload.findGlobal({
		slug: "courses-page",
		depth: 1,
	});

	if (!header?.title || !platforms?.title || !selection?.title)
		return { props: { coursesPage: null } };

	return { props: { coursesPage: { header, platforms, selection } } };
};

const useStyles = tss.withName({ SeFormer }).create({
	preLine: {
		whiteSpace: "pre-line",
	},
	headerImage: {
		display: "block",
		width: "100%",
		height: "auto",
		aspectRatio: "16 / 10",
		objectFit: "cover",
	},
	coloredContainer: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
	},
	steps: {
		listStyle: "none",
		padding: 0,
		"& > li": {
			paddingBottom: 0,
			"&::marker": {
				content: "none",
			},
		},
	},
	step: {
		height: "100%",
		display: "flex",
		flexDirection: "column",
		gap: "12px",
		padding: fr.spacing("4w"),
		"& > *": {
			margin: 0,
		},
		"& > *:last-child": {
			marginBottom: "1.15rem",
		},
		backgroundColor: fr.colors.decisions.background.default.grey.default,
		border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		borderBottom: `4px solid ${fr.colors.decisions.border.plain.blueFrance.default}`,
	},
	stepNumber: {
		fontSize: "2rem",
		lineHeight: "2.5rem",
		fontWeight: 700,
		color: fr.colors.decisions.text.title.blueFrance.default,
	},
	buttonContainer: {
		display: "flex",
		justifyContent: "center",
		marginTop: fr.spacing("4w"),
	},
});
