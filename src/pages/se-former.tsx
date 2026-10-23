import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Button from "@codegouvfr/react-dsfr/Button";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useId } from "react";
import { getPayload } from "payload";
import { tss } from "tss-react/dsfr";
import PlatformCard from "~/components/Courses/PlatformCard";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import PageContent from "~/components/ui/PageContent";
import type { CoursesPage } from "~/payload/payload-types";
import payloadConfig from "~/payload/payload.config";

type Props = {
	coursesPage: Pick<CoursesPage, "platforms" | "selection"> | null;
};

export default function SeFormer({ coursesPage }: Props) {
	const { classes, cx } = useStyles();
	const selectionTitleId = useId();

	if (!coursesPage) return <EmptyScreenZone>Contenu manquant</EmptyScreenZone>;

	const { platforms, selection } = coursesPage;
	const { label: selectionLinkLabel, url: selectionLinkUrl } =
		selection.link ?? {};

	return (
		<>
			<Head>
				<title>Se former - Maison de l'autisme</title>
				<meta name="description" content={platforms.description} />
			</Head>
			<PageContent>
				<div className={fr.cx("fr-container", "fr-pb-8w")}>
					<Breadcrumb
						currentPageLabel="Se former"
						homeLinkProps={{ href: "/" }}
						segments={[]}
					/>
					<h1 className={fr.cx("fr-mb-2w")}>{platforms.title}</h1>
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
				</div>
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
	const { platforms, selection } = await payload.findGlobal({
		slug: "courses-page",
		depth: 1,
	});

	if (!platforms?.title || !selection?.title)
		return { props: { coursesPage: null } };

	return { props: { coursesPage: { platforms, selection } } };
};

const useStyles = tss.withName({ SeFormer }).create({
	preLine: {
		whiteSpace: "pre-line",
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
