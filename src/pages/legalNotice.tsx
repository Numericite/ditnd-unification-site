import { fr } from "@codegouvfr/react-dsfr";
import Head from "next/head";
import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import { Loader } from "~/components/ui/Loader";
import WysiwygContent from "~/components/ui/PracticalGuides/WysiwygContent";
import { api } from "~/utils/api";

export default function LegalNotice() {
	const { data: pageContent, isLoading: isLoadingData } =
		api.cms.legalNotice.useQuery();

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
				<title>DITND - Mention légales</title>
				<meta name="description" content={`DITND - Mention légales`} />
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
