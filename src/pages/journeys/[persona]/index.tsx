import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { PersonaTiles, type TagItem } from "~/components/HomePage/PersonaTiles";
import { Loader } from "~/components/ui/Loader";
import { proStore } from "~/state/store";
import { api } from "~/utils/api";
import { personas } from "~/utils/personas";

export default function JourneyPage() {
	const router = useRouter();
	const persona_slug = router.query.persona as string;

	const { data: conditions, isLoading: isLoadingConditions } =
		api.condition.all.useQuery();

	const professionalPersonas = proStore.get();

	const persona = persona_slug.startsWith("pro")
		? professionalPersonas?.find((c) => c.slug === persona_slug)
		: personas.find((p) => p.slug === persona_slug);

	const defaultTags: TagItem[] = useMemo(() => {
		if (persona_slug.startsWith("pro")) {
			return [
				{
					display: "default",
					label: "",
					slug: "professional",
				},
				{
					display: "professional",
					label: "",
					slug: persona_slug,
				},
			];
		}

		return [
			{
				display: "default",
				label: "",
				slug: persona_slug,
			},
		];
	}, [persona_slug]);

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
	) {
		return <div>Conditions ou personas introuvables</div>;
	}

	return (
		<>
			<Head>
				<title>DITND - Page du persona</title>
			</Head>
			<div className={fr.cx("fr-container")}>
				<Breadcrumb
					className={fr.cx("fr-mb-2v")}
					currentPageLabel={persona?.name.toLowerCase()}
					homeLinkProps={{
						href: "/",
					}}
					segments={[]}
				/>
				<h1>{persona?.name}</h1>
				<div className={fr.cx("fr-pb-4w")}>
					<PersonaTiles
						key={persona_slug}
						tiles={personas}
						defaultDisplay="person"
						defaultTags={defaultTags}
						hideTags
					/>
				</div>
			</div>
		</>
	);
}
