import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import { Loader } from "~/components/ui/Loader";
import WysiwygContent from "~/components/ui/PracticalGuides/WysiwigContent";
import { api } from "~/utils/api";

export default function Accessibility() {
	const { data: pageContent, isLoading: isLoadingData } =
		api.cms.accessibility.useQuery();

	if (isLoadingData) return <Loader />;

	if (!pageContent) return <EmptyScreenZone>Missing content</EmptyScreenZone>;

	return (
		<>
			<Head>
				<title>DITND - Accessibilité</title>
				<meta name="description" content={`DITND - Accessibilité`} />
			</Head>
			<div className={fr.cx("fr-container", "fr-py-10w")}>
				<WysiwygContent title={pageContent.title} html={pageContent.html} />
			</div>
		</>
	);
}
