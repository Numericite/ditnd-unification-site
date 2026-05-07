import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { tss } from "tss-react/dsfr";
import PersonaDisplay from "~/components/PersonaPage/PersonaDisplay";
import PageContent from "~/components/ui/PageContent";
import { createCaller } from "~/server/api/root";
import type { AugmentedJourney } from "~/server/api/routers/journeys";
import { createTRPCContext } from "~/server/api/trpc";

function isProfessionalPersona(_slug: string) {
	// TODO: Réactiver le sous-niveau spécifique aux professionnels
	// return slug.startsWith("pro");
	return false;
}

type Props = {
	journey: AugmentedJourney;
	persona: string;
	condition: string;
};

export default function JourneyPage({ journey, persona, condition }: Props) {
	const { classes, cx } = useStyles();

	const isProPersona = isProfessionalPersona(persona);

	const journeyBreadcrumbText = journey.persona?.displayName
		? `Je suis ${journey.persona.displayName}`
		: (journey.persona?.name ?? "");

	const breadcrumbSegments = isProPersona
		? [
				{
					label: "Je suis un professionnel",
					linkProps: { href: "/parcours/professional" },
				},
				{
					label: journeyBreadcrumbText,
					linkProps: { href: `/parcours/${persona}` },
				},
			]
		: [
				{
					label: journeyBreadcrumbText,
					linkProps: { href: `/parcours/${persona}` },
				},
			];

	return (
		<>
			<Head>
				<title>{journey.journey_name} - Maison de l'autisme</title>
				<meta
					name="description"
					content={`Page de parcours en tant que ${journey.persona.name.toLowerCase()}, où vous trouverez des ressources sur le ${condition.toUpperCase()}`}
				/>
			</Head>
			<div className={fr.cx("fr-container")}>
				<Breadcrumb
					currentPageLabel={condition.toUpperCase()}
					homeLinkProps={{
						href: "/",
					}}
					segments={breadcrumbSegments}
				/>
			</div>
			<PageContent>
				<div className={fr.cx("fr-container")}>
					<div className={fr.cx("fr-py-4w")}>
						<div
							className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}
							style={{ alignItems: "stretch" }}
						>
							<div
								className={fr.cx("fr-col-12", "fr-col-lg-6")}
								style={{ alignContent: "center" }}
							>
								<h1>{`${journey.persona.journeyIntro ?? `Je suis un ${journey.persona.name.toLowerCase()} interessé par le`} ${condition.toUpperCase()}`}</h1>
								<p>
									Le TSA, ou trouble du spectre de l’autisme, est un trouble du
									neurodéveloppement qui se manifeste dès l’enfance et qui
									accompagne la personne tout au long de sa vie. Il se
									caractérise principalement par des difficultés dans la
									communication et les interactions sociales, ainsi que par des
									comportements et intérêts restreints et répétitifs.
								</p>
							</div>
							<div className={fr.cx("fr-col-12", "fr-col-lg-6")}>
								<Image
									className={fr.cx("fr-responsive-img")}
									fetchPriority="high"
									priority
									alt=""
									role="presentation"
									src={journey.image?.url ?? "/placeholder.16x9.png"}
									width={580}
									height={350}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className={cx(classes.coloredContainer)}>
					<PersonaDisplay journey={journey} from={`${persona}/${condition}`} />
				</div>
			</PageContent>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
	const persona = ctx.params?.persona;
	const condition = ctx.params?.condition;

	if (typeof persona !== "string" || typeof condition !== "string") {
		return { notFound: true };
	}

	const caller = createCaller(await createTRPCContext());

	try {
		const journeys = await caller.journey.getByPersona({ persona });
		const journey = journeys[0];

		if (!journey) {
			return { notFound: true };
		}

		return {
			props: {
				journey,
				persona,
				condition,
			},
		};
	} catch {
		return { notFound: true };
	}
};

const useStyles = tss.withName(JourneyPage.name).create({
	coloredContainer: {
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
	},
	summarySticky: {
		position: "sticky",
		top: "20px",
		".fr-summary__link:before": {
			visibility: "hidden",
		},
	},
	centeredContainer: {
		textAlign: "center",
		paddingTop: fr.spacing("4w"),
	},
});
