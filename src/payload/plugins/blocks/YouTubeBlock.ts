import type { Block } from "payload";

export const YouTubeBlock: Block = {
	slug: "youtube",
	labels: {
		singular: "Vidéo YouTube",
		plural: "Vidéos YouTube",
	},
	fields: [
		{
			name: "url",
			type: "text",
			required: true,
			label: { fr: "URL YouTube" },
			admin: {
				placeholder:
					"https://www.youtube.com/watch?v=... ou https://youtu.be/...",
			},
			validate: (val: string | undefined | null) => {
				if (!val) return "L'URL YouTube est requise";
				try {
					const parsed = new URL(val);
					const isYouTube =
						parsed.hostname.includes("youtube.com") ||
						parsed.hostname === "youtu.be";
					if (!isYouTube) {
						return "L'URL doit être une URL YouTube valide";
					}
					return true;
				} catch {
					return "L'URL n'est pas valide";
				}
			},
		},
		{
			name: "sizeUnit",
			type: "select",
			required: true,
			defaultValue: "percent",
			label: { fr: "Unité de taille" },
			options: [
				{ label: "Pourcentage (%)", value: "percent" },
				{ label: "Pixels (px)", value: "pixel" },
			],
			admin: {
				width: "50%",
			},
		},
		{
			name: "sizeValue",
			type: "number",
			required: true,
			defaultValue: 100,
			label: { fr: "Taille" },
			admin: {
				width: "50%",
				step: 1,
			},
			validate: (val: number | undefined | null, { siblingData }: any) => {
				if (val == null) return "La taille est requise";
				if (val <= 0) return "La taille doit être supérieure à 0";
				if (siblingData?.sizeUnit === "percent" && val > 100) {
					return "Le pourcentage ne peut pas dépasser 100%";
				}
				return true;
			},
		},
		{
			name: "preview",
			type: "ui",
			admin: {
				components: {
					Field: "../payload/components/YouTubeEmbed",
				},
			},
		},
	],
};
