import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import { Loader } from "~/components/ui/Loader";
import WysiwygContent from "~/components/ui/PracticalGuides/WysiwygContent";
import { api } from "~/utils/api";

export default function Accessibility() {
	const { data: pageContent, isLoading: isLoadingData } =
		api.cms.accessibility.useQuery();

	if (isLoadingData)
		return (
			<EmptyScreenZone>
				<Loader />
			</EmptyScreenZone>
		);

	if (!pageContent) return <EmptyScreenZone>Missing content</EmptyScreenZone>;

	return (
		<>
			<Head>
				<title>Accessibilité - Maison de l'autisme</title>
				<meta name="description" content="Déclaration d'accessibilité du site Maison de l'autisme, site national d'informations sur l'autisme et les troubles du neurodéveloppement." />
			</Head>
			<div className={fr.cx("fr-container", "fr-py-10w")}>
				<WysiwygContent
					title={pageContent.title}
					content={pageContent.content}
				/>
			</div>
		</>
	);
}
