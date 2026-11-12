import type { Block, BlocksField } from "payload";
import { standardFields } from "~/payload/fields/standards";
import {
	HOME_SECTION_LABELS,
	HOME_SECTION_TYPES,
	type HomeSectionType,
} from "./homeSectionLabels";

const SOCIAL_NETWORK_OPTIONS = [
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

const visibleField = {
	name: "visible",
	label: "Afficher la section",
	type: "checkbox",
	defaultValue: true,
} as const;

const section = (
	slug: HomeSectionType,
	interfaceName: string,
	fields: Block["fields"],
): Block => ({
	slug,
	interfaceName,
	labels: {
		singular: HOME_SECTION_LABELS[slug],
		plural: HOME_SECTION_LABELS[slug],
	},
	admin: {
		disableBlockName: true,
		components: { Label: "./components/HomeSectionRowLabel" },
	},
	fields: [visibleField, ...fields],
});

const newsCarouselSection = section(
	"newsCarousel",
	"HomeNewsCarouselSection",
	[],
);

const personaTilesSection = section("personaTiles", "HomePersonaTilesSection", [
	{
		name: "persona",
		label: "Choix du profil",
		type: "group",
		fields: [standardFields.title, standardFields.longDescription],
	},
	{
		name: "condition",
		label: "Choix du trouble",
		type: "group",
		fields: [standardFields.title, standardFields.longDescription],
	},
]);

const mostViewedGuidesSection = section(
	"mostViewedGuides",
	"HomeMostViewedGuidesSection",
	[standardFields.title, standardFields.longDescription],
);

const newsletterSection = section("newsletter", "HomeNewsletterSection", [
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
]);

const labelList = (types: HomeSectionType[]) =>
	types.map((type) => `« ${HOME_SECTION_LABELS[type]} »`).join(", ");

export const homeSectionsField: BlocksField = {
	name: "sections",
	label: "Sections",
	labels: { singular: "Section", plural: "Sections" },
	type: "blocks",
	maxRows: HOME_SECTION_TYPES.length,
	admin: {
		initCollapsed: true,
		description:
			"Glissez-déposez les sections pour changer leur ordre d'affichage sous l'en-tête. Décochez « Afficher la section » pour la masquer sans perdre son contenu.",
	},
	blocks: [
		newsCarouselSection,
		personaTilesSection,
		mostViewedGuidesSection,
		newsletterSection,
	],
	validate: (value) => {
		const types = ((value ?? []) as { blockType: HomeSectionType }[]).map(
			(row) => row.blockType,
		);

		const duplicated = HOME_SECTION_TYPES.filter(
			(type) => types.filter((t) => t === type).length > 1,
		);
		if (duplicated.length > 0) {
			return `Chaque section ne peut apparaître qu'une fois : ${labelList(duplicated)}.`;
		}

		const missing = HOME_SECTION_TYPES.filter((type) => !types.includes(type));
		if (missing.length > 0) {
			return `Sections manquantes : ${labelList(missing)}. Masquez une section plutôt que de la supprimer.`;
		}

		return true;
	},
};
