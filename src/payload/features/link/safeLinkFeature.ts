import {
	type FeatureProviderServer,
	LinkFeature,
} from "@payloadcms/richtext-lexical";
import type { FieldHook } from "payload";
import { normalizeLinkUrl } from "./normalizeLinkUrl";

const normalizeUrlHook: FieldHook = ({ value }) => normalizeLinkUrl(value);

/**
 * LinkFeature dont le champ `url` remplace le hook beforeChange de Payload (qui
 * ré-encode les URLs à chaque enregistrement) par normalizeLinkUrl.
 */
export const SafeLinkFeature = () =>
	LinkFeature({
		fields: ({ defaultFields }) =>
			defaultFields.map((field) =>
				field.name === "url" && field.type === "text"
					? {
							...field,
							hooks: {
								...field.hooks,
								beforeValidate: [normalizeUrlHook],
								beforeChange: [normalizeUrlHook],
							},
						}
					: field,
			),
	});

/** Remplace la LinkFeature par défaut d'une liste de features lexical. */
export const withSafeLinkFeature = (features: FeatureProviderServer[]) =>
	features.map((feature) =>
		feature.key === "link" ? SafeLinkFeature() : feature,
	);
