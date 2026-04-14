import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import { Loader } from "~/components/ui/Loader";
import WysiwygContent from "~/components/ui/PracticalGuides/WysiwygContent";
import { api } from "~/utils/api";

export default function Cgu() {
	const { data: pageContent, isLoading: isLoadingData } =
		api.cms.cgu.useQuery();

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
				<title>Politique de confidentialité - Maison de l'autisme</title>
				<meta
					name="description"
					content="Politique de confidentialité et protection des données personnelles du site Maison de l'autisme."
				/>
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
