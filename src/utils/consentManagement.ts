import { createConsentManagement } from "@codegouvfr/react-dsfr/consentManagement";

export const {
	useConsent,
	ConsentBannerAndConsentManagement,
	FooterConsentManagementItem,
	FooterPersonalDataPolicyItem,
} = createConsentManagement({
	finalityDescription: {
		youtube: {
			title: "Vidéos YouTube",
			description: "Permet l'affichage des vidéos intégrées depuis YouTube.",
		},
		cartographie: {
			title: "Cartographie",
			description:
				"Permet l'affichage des cartes interactives (fonds de carte IGN et données géographiques).",
		},
		matomo: {
			title: "Mesure d'audience (Matomo)",
			description:
				"Permet la mesure d'audience du site via Matomo, avec suivi individuel du parcours de navigation.",
		},
	},
	personalDataPolicyLinkProps: { href: "/gestion-des-cookies" },
});
