import { redirectsPlugin } from "@payloadcms/plugin-redirects";
import type { Field } from "payload";

/**
 * Redirections 301 de l'ancien site WordPress (et futurs renommages de slugs).
 * Voir docs/plan-redirections-seo.md pour le plan complet.
 *
 * Workflow : la collection est pré-remplie (seed:redirects) avec les anciennes
 * URLs et une cible vide. Une cible vide = travail restant pour l'équipe
 * contenu ; l'URL est couverte entre-temps par les fallbacks de section du
 * middleware. Ne jamais supprimer une redirection remplie après le lancement.
 */

/** Normalise une URL source : path seul, sans domaine, slash final ni query. */
export const normalizeFromPath = (raw: string): string => {
	let from = raw.trim();
	from = from.replace(/^https?:\/\/[^/]+/i, "");
	from = from.split(/[?#]/)[0] ?? "";
	if (!from.startsWith("/")) from = `/${from}`;
	if (from.length > 1) from = from.replace(/\/+$/, "");
	return from.toLowerCase();
};

export const mdaRedirectsPlugin = redirectsPlugin({
	// Collections pointables en cible "référence interne" : les seules dont
	// l'URL publique se résout depuis le seul slug. Pour toute autre page
	// (parcours, pages statiques…), utiliser une cible "URL personnalisée".
	collections: ["practical-guides", "courses"],
	overrides: {
		admin: {
			group: { fr: "Autre", en: "Other" },
			defaultColumns: ["from", "to.type", "legacyTitle", "updatedAt"],
			description: {
				fr: "Redirections 301 des anciennes URLs. Une cible vide = redirection à compléter (l'URL retombe sur la page de section en attendant). Ne pas supprimer une redirection remplie.",
				en: "301 redirects for legacy URLs. An empty target = still to be filled in. Never delete a filled redirect.",
			},
		},
		fields: ({ defaultFields }) =>
			defaultFields
				.map((field) => {
					// Cibles optionnelles : une entrée seedée sans cible est un "todo"
					// visible dans l'admin, pas une erreur de validation.
					if ("name" in field && field.name === "to" && "fields" in field) {
						return {
							...field,
							fields: (field.fields as Field[]).map((sub) =>
								"name" in sub &&
								(sub.name === "reference" || sub.name === "url")
									? { ...sub, required: false }
									: sub,
							),
						} as Field;
					}
					return field;
				})
				.concat([
					{
						name: "legacyTitle",
						type: "text",
						label: {
							fr: "Titre de l'ancienne page",
							en: "Legacy page title",
						},
						admin: {
							description: {
								fr: "Rempli par le seed — aide à retrouver la page équivalente sur le nouveau site.",
								en: "Filled by the seed script.",
							},
						},
					},
				]),
		hooks: {
			beforeValidate: [
				({ data }) => {
					if (!data) return data;
					if (typeof data.from === "string" && data.from.length > 0) {
						data.from = normalizeFromPath(data.from);
					}
					// Anti-boucle : une redirection vers sa propre source est refusée.
					if (
						data.to?.type === "custom" &&
						typeof data.to.url === "string" &&
						data.to.url.length > 0 &&
						normalizeFromPath(data.to.url) === data.from
					) {
						throw new Error(
							`Redirection en boucle : la cible "${data.to.url}" correspond à la source "${data.from}".`,
						);
					}
					return data;
				},
			],
		},
	},
});
