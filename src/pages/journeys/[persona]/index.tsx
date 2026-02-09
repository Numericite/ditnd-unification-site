import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import { useRouter } from "next/router";
import { tss } from "tss-react";
import { PersonaTiles, type TagItem } from "~/components/HomePage/PersonaTiles";
import { Loader } from "~/components/ui/Loader";
import { personStore, proStore } from "~/state/store";
import { api } from "~/utils/api";
import { personsAndProTiles } from "~/utils/tools";

function isProfessional(persona_slug: string) {
	return persona_slug === "professional";
}

export default function JourneyPage() {
	const { classes, cx } = useStyles();

	const router = useRouter();
	const persona_slug = router.query.persona as string;

	const { data: conditions, isLoading: isLoadingConditions } =
		api.condition.all.useQuery();

	const professionalPersonas = proStore.get();

	const personas = personsAndProTiles(personStore.get());

	const persona = personas.find((p) => p.slug === persona_slug);

	const defaultTags: TagItem[] = [
		{
			display: isProfessional(persona_slug) ? "professional" : "default",
			label: persona?.name ?? "",
			slug: persona_slug,
		},
	];

	const defaultDisplay = isProfessional(persona_slug)
		? "professional"
		: "person";

	if (
		isLoadingConditions &&
		!professionalPersonas &&
		!conditions &&
		!professionalPersonas
	)
		return <Loader />;

	if (
		!conditions ||
		!professionalPersonas ||
		conditions.length === 0 ||
		professionalPersonas.length === 0
	)
		return <div>Conditions ou personas introuvables</div>;

	return (
		<>
			<Head>
				<title>DITND - Page du persona</title>
			</Head>
			<div className={cx(classes.coloredContainer)}>
				<div className={fr.cx("fr-pb-4w", "fr-container")}>
					<PersonaTiles
						key={persona_slug}
						tiles={personas}
						defaultDisplay={defaultDisplay}
						defaultTags={defaultTags}
						hideTags
						breadCrumb
						mainTitle
					/>
				</div>
			</div>
		</>
	);
}

const useStyles = tss.withName(JourneyPage.name).create({
	coloredContainer: {
		height: "auto",
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
	},
});
