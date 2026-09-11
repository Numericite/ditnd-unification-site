"use client";

import { fr } from "@codegouvfr/react-dsfr";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import TechnicalError from "@codegouvfr/react-dsfr/picto/TechnicalError";
import Image from "next/image";
import { tss } from "tss-react/dsfr";

export default function ErrorPage() {
	const { classes } = useStyles();

	return (
		<div className={fr.cx("fr-container")}>
			<div
				className={fr.cx(
					"fr-my-14v",
					"fr-mt-md-24v",
					"fr-mb-md-20v",
					"fr-grid-row",
					"fr-grid-row--gutters",
					"fr-grid-row--middle",
					"fr-grid-row--center",
				)}
			>
				<div className={fr.cx("fr-py-0", "fr-col-12", "fr-col-md-6")}>
					<h1 id="page-non-trouvee">Page non trouvée</h1>
					<p className={fr.cx("fr-text--sm", "fr-mb-3w")}>Erreur 404</p>
					<p className={fr.cx("fr-text--lead", "fr-mb-3w")}>
						La page que vous cherchez est introuvable. Excusez-nous pour la gêne
						occasionnée.
					</p>
					<p className={fr.cx("fr-text--sm", "fr-mb-5w")}>
						Si vous avez tapé l'adresse web dans le navigateur, vérifiez qu'elle
						est correcte. La page n'est peut-être plus disponible.
						<br />
						Dans ce cas, pour continuer votre visite vous pouvez consulter notre
						page d'accueil, ou effectuer une recherche avec notre moteur de
						recherche en haut de page.
					</p>
					<ButtonsGroup
						inlineLayoutWhen="md and up"
						buttons={[{ children: "Page d'accueil", linkProps: { href: "/" } }]}
					/>
				</div>
				<div
					className={fr.cx(
						"fr-col-12",
						"fr-col-md-3",
						"fr-col-offset-md-1",
						"fr-px-6w",
						"fr-px-md-0",
						"fr-py-0",
					)}
				>
					<div className={classes.illustration}>
						<Image
							alt=""
							role="presentation"
							src="/ErrorPageBackground.svg"
							width={320}
							height={400}
							className={classes.illustrationBackground}
						/>
						<TechnicalError className={classes.illustrationPicto} />
					</div>
				</div>
			</div>
		</div>
	);
}

const useStyles = tss.withName("ErrorPage").create(() => ({
	illustration: {
		position: "relative",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	illustrationBackground: {
		width: "100%",
		height: "auto",
	},
	illustrationPicto: {
		position: "absolute",
		fontSize: "8rem",
	},
}));
