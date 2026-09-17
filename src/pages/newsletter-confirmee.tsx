import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import PageContent from "~/components/ui/PageContent";

const TITLE = "Inscription à la lettre d'information confirmée";

export default function NewsletterConfirmedPage() {
	return (
		<>
			<Head>
				<title>{TITLE} - Maison de l&apos;autisme</title>
				<meta name="robots" content="noindex" />
				<meta
					name="description"
					content="Confirmation de votre inscription à la lettre d'information de la Maison de l'autisme."
				/>
			</Head>
			<div className={fr.cx("fr-container", "fr-pb-10v")}>
				<Breadcrumb
					currentPageLabel={TITLE}
					homeLinkProps={{ href: "/" }}
					segments={[]}
				/>
				<PageContent>
					<h1>{TITLE}</h1>
					<Alert
						severity="success"
						title="Votre inscription a bien été prise en compte"
						description="Vous recevrez désormais notre lettre d'information. Vous pouvez vous désinscrire à tout moment grâce au lien présent en bas de chaque courriel."
					/>
					<p className={fr.cx("fr-mt-4w")}>
						<a
							href="/"
							className={fr.cx(
								"fr-link",
								"fr-icon-arrow-left-line",
								"fr-link--icon-left",
							)}
						>
							Retour à l&apos;accueil
						</a>
					</p>
				</PageContent>
			</div>
		</>
	);
}
