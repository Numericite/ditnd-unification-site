import type { GlobalConfig } from "payload";
import { hideForNonAdmin, isAdmin } from "~/payload/hooks";

export const SOCIAL_NETWORK_OPTIONS = [
	{ label: "Facebook", value: "facebook" },
	{ label: "Github", value: "github" },
	{ label: "Instagram", value: "instagram" },
	{ label: "LinkedIn", value: "linkedin" },
	{ label: "Mastodon", value: "mastodon" },
	{ label: "TikTok", value: "tiktok" },
	{ label: "Twitch", value: "twitch" },
	{ label: "X (anciennement Twitter)", value: "twitter-x" },
	{ label: "Vimeo", value: "vimeo" },
	{ label: "Youtube", value: "youtube" },
	{ label: "Dailymotion", value: "dailymotion" },
	{ label: "Telegram", value: "telegram" },
	{ label: "Threads", value: "threads" },
	{ label: "Email", value: "mail" },
] as const;

export const CMSNewsletter: GlobalConfig = {
	slug: "newsletter",
	label: "Lettre d'information",
	admin: {
		group: { fr: "Pages" },
		hidden: hideForNonAdmin,
		description:
			"Bloc affiché en bas de la page d'accueil. Décochez « Afficher le bloc » pour le retirer du site.",
	},
	access: {
		read: isAdmin,
		update: isAdmin,
	},
	fields: [
		{
			name: "enabled",
			label: "Afficher le bloc",
			type: "checkbox",
			defaultValue: true,
		},
		{
			name: "title",
			label: "Titre",
			type: "text",
			admin: {
				description:
					"Laissez vide pour utiliser le libellé DSFR par défaut : « Abonnez-vous à notre lettre d'information ».",
			},
		},
		{
			name: "description",
			label: "Description",
			type: "textarea",
		},
		{
			name: "consentHint",
			label: "Mention de consentement",
			type: "textarea",
			admin: {
				description:
					"Affichée sous le champ email. Laissez vide pour utiliser la mention DSFR par défaut.",
			},
		},
		{
			name: "socialTitle",
			label: "Titre du bloc réseaux sociaux",
			type: "text",
			admin: {
				description:
					"Laissez vide pour utiliser le libellé DSFR par défaut : « Suivez-nous sur les réseaux sociaux ».",
			},
		},
		{
			name: "socials",
			label: "Réseaux sociaux",
			labels: { singular: "Réseau social", plural: "Réseaux sociaux" },
			type: "array",
			admin: {
				description:
					"Si aucun réseau n'est renseigné, la colonne réseaux sociaux n'est pas affichée.",
			},
			fields: [
				{
					name: "type",
					label: "Réseau",
					type: "select",
					required: true,
					options: [...SOCIAL_NETWORK_OPTIONS],
				},
				{
					name: "url",
					label: "Lien",
					type: "text",
					required: true,
				},
			],
		},
	],
};
