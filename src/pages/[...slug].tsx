import type { GetServerSideProps } from "next";
import Head from "next/head";
import ErrorPage from "~/components/ui/ErrorPage/ErrorPage";
import { legacyRedirect } from "~/server/redirects";

export default function CatchAll() {
	return (
		<>
			<Head>
				<title>Erreur 404 - Maison de l'autisme</title>
				<meta name="robots" content="noindex" />
			</Head>
			<ErrorPage />
		</>
	);
}

export const getServerSideProps: GetServerSideProps = async ({
	res,
	resolvedUrl,
}) => {
	const redirect = await legacyRedirect(resolvedUrl);
	if (redirect) return redirect;

	res.statusCode = 404;
	return { props: {} };
};
