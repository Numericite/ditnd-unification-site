import {
	type FeatureProviderServer,
	LinkFeature,
	type LinkFeatureServerProps,
} from "@payloadcms/richtext-lexical";
import type {
	Field,
	FieldAffectingData,
	FieldHook,
	TextField,
	TextFieldValidation,
} from "payload";
import { normalizeLinkUrl } from "./normalizeLinkUrl";

const normalizeUrlHook: FieldHook = ({ value }) => normalizeLinkUrl(value);

/**
 * Remplace sur le champ `url` le hook beforeChange de Payload (qui ré-encode les
 * URLs à chaque enregistrement) par normalizeLinkUrl.
 *
 * La validation de Payload (refus des espaces) est conservée mais appliquée à
 * l'URL normalisée : le formulaire de l'admin valide sans exécuter les hooks,
 * il refuserait sinon une URL saisie avec une espace avant qu'elle soit encodée.
 *
 * Pas de hook beforeValidate : lexical n'exécute les beforeValidate des
 * sous-champs que si un nœud de l'éditeur déclare lui-même un beforeValidate,
 * ce qui n'est le cas d'aucune feature utilisée ici. Le beforeChange suffit,
 * Payload l'exécutant avant la validation.
 */
const withNormalizedUrl = <F extends Field | FieldAffectingData>(
	field: F,
): F => {
	if (field.type !== "text" || !("name" in field) || field.name !== "url") {
		return field;
	}
	const { hooks } = field as TextField;
	// Champ `url` sans hasMany : sa validation porte sur une chaîne.
	const validate = (field as TextField).validate as
		| TextFieldValidation
		| undefined;
	const validateNormalized: TextFieldValidation = (value, options) =>
		validate ? validate(normalizeLinkUrl(value), options) : true;
	return {
		...field,
		hooks: { ...hooks, beforeChange: [normalizeUrlHook] },
		validate: validateNormalized,
	};
};

/**
 * LinkFeature dont le champ `url` est normalisé par normalizeLinkUrl. Accepte
 * les mêmes options que LinkFeature, champs personnalisés compris.
 */
export const SafeLinkFeature = (props: LinkFeatureServerProps = {}) =>
	LinkFeature({
		...props,
		fields: (args) => {
			const fields =
				typeof props.fields === "function"
					? props.fields(args)
					: (props.fields ?? args.defaultFields);
			return fields.map(withNormalizedUrl);
		},
	});

/**
 * Remplace la LinkFeature d'une liste de features lexical par SafeLinkFeature,
 * en conservant ses options.
 */
export const withSafeLinkFeature = (features: FeatureProviderServer[]) =>
	features.map((feature) =>
		feature.key === "link"
			? SafeLinkFeature(
					(feature.serverFeatureProps ?? {}) as LinkFeatureServerProps,
				)
			: feature,
	);
