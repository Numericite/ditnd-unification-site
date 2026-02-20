import {
	FixedToolbarFeature,
	HeadingFeature,
	RelationshipFeature,
	type FeatureProviderServer,
} from "@payloadcms/richtext-lexical";

export const defaultWysiwygFeatures = ({
	defaultFeatures,
}: {
	defaultFeatures: FeatureProviderServer[];
}) => {
	return [
		...defaultFeatures.filter(
			(feature) =>
				feature.key !== "checklist" &&
				feature.key !== "inlineCode" &&
				feature.key !== "indent",
		),
		FixedToolbarFeature(),
		HeadingFeature({
			enabledHeadingSizes: ["h2", "h3", "h4", "h5", "h6"],
		}),
		RelationshipFeature({
			disabledCollections: [
				"users",
				"personas",
				"conditions",
				"journeys",
				"themes",
			],
		}),
	];
};
