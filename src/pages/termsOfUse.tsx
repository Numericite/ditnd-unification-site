import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import { Loader } from "~/components/ui/Loader";
import WysiwygContent from "~/components/ui/PracticalGuides/WysiwigContent";
import { api } from "~/utils/api";

export default function TermsOfUse() {
	const { data: pageContent, isLoading: isLoadingData } =
		api.cms.termsOfUse.useQuery();

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
				<title>DITND - Modalités d'utilisation</title>
				<meta name="description" content={`DITND - Modalités d'utilisation`} />
			</Head>
			<div className={fr.cx("fr-container", "fr-py-10w")}>
				<WysiwygContent title={pageContent.title} html={pageContent.html} />
			</div>
		</>
	);
}
