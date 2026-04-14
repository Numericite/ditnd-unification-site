import { EmptyScreenZone } from "~/components/ui/EmptyScreenZone";
import Head from "next/head";

export default function Annuaire() {
	return (
		<>
			<Head>
				<title>Annuaire de ressources pour l'autisme - Maison de l'autisme</title>
				<meta
					name="description"
					content="Annuaire de ressources pour l'autisme : contacts et organismes utiles pour les personnes autistes et leur entourage."
				/>
			</Head>
			<EmptyScreenZone>Annuaire</EmptyScreenZone></>);
}
