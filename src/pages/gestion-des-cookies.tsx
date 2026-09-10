import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import PageContent from "~/components/ui/PageContent";

export default function CookiesManagement() {
	return (
		<>
			<Head>
				<title>Données personnelles et cookies - Maison de l'autisme</title>
				<meta
					name="description"
					content="Informations sur les cookies utilisés par le site Maison de l'autisme et gestion de vos préférences."
				/>
			</Head>
			<div className={fr.cx("fr-container", "fr-pb-10v")}>
				<Breadcrumb
					currentPageLabel="Données personnelles et cookies"
					homeLinkProps={{ href: "/" }}
					segments={[]}
				/>
				<PageContent>
					<h1>Données personnelles et cookies</h1>
					<p>
						Ce site utilise des cookies déposés par des services tiers pour
						certaines fonctionnalités. Vous pouvez choisir, pour chacune
						d'elles, d'autoriser ou de refuser le dépôt de ces cookies.
					</p>
					<h2 className={fr.cx("fr-h4")}>Vidéos YouTube</h2>
					<p>
						Certaines pages du site intègrent des vidéos hébergées sur YouTube.
						Si vous n'autorisez pas ces cookies, la vidéo est remplacée par un
						message vous proposant de l'autoriser au cas par cas.
					</p>
					<h2 className={fr.cx("fr-h4")}>Cartographie</h2>
					<p>
						Certaines pages du site intègrent des cartes interactives (fonds de
						carte IGN et données géographiques). Si vous n'autorisez pas ces
						cookies, la carte est remplacée par un message vous proposant de
						l'autoriser.
					</p>
					<h2 className={fr.cx("fr-h4")}>Mesure d'audience (Matomo)</h2>
					<p>
						Ce site utilise Matomo pour mesurer sa fréquentation. Si vous
						n'autorisez pas ces cookies, votre navigation n'est pas suivie par
						cet outil.
					</p>
					<button
						type="button"
						className={fr.cx("fr-btn")}
						aria-controls="fr-consent-modal"
						data-fr-opened={false}
					>
						Gérer mes préférences de cookies
					</button>
				</PageContent>
			</div>
		</>
	);
}
