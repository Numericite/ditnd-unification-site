import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import Head from "next/head";

export default function Actus() {
	return (
		<>
			<Head>
				<title>Actualités - Maison de l'autisme</title>
				<meta
					name="description"
					content="Actualités de la Maison de l'autisme : dernières nouvelles, événements et ressources sur l'autisme et les troubles du neurodéveloppement."
				/>
			</Head>
			<EmptyScreenZone>Actualités</EmptyScreenZone>
		</>
	);
}
