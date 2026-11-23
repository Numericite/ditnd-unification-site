import Head from "next/head";
import ErrorPage from "~/components/ui/ErrorPage/ErrorPage";
import type { PageProps } from "~/server/pages";
import PageView from "./PageView";
import SectionView from "./SectionView";

export default function CmsPage(props: PageProps) {
	if (props.isNotFound) {
		return (
			<>
				<Head>
					<title>Page non trouvée - Maison de l'autisme</title>
					<meta name="robots" content="noindex" />
				</Head>
				<ErrorPage />
			</>
		);
	}

	if (props.kind === "section") {
		return <SectionView section={props.section} links={props.links} />;
	}

	return <PageView page={props.page} />;
}
