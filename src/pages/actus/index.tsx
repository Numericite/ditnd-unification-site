import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import Head from "next/head";


export default function Actus() {
	return (
		<>
			<Head>
				<title>DITND - Actualités</title>
				<meta
					name="description"
					content={`Page d'actualité en cours de construction`}
				/>
			</Head>
			<EmptyScreenZone>Actualités</EmptyScreenZone></>);
}
