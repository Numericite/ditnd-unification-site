import Head from "next/head";
import ErrorPage from "~/components/ui/ErrorPage/ErrorPage";
import type { PageProps } from "~/server/pages";
import PageView from "./PageView";

export default function CmsPage(props: PageProps) {
	if (props.isNotFound || !props.page) {
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

	return <PageView page={props.page} />;
}
