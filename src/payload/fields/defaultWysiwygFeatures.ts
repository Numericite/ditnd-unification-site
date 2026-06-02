import {
	BlocksFeature,
	EXPERIMENTAL_TableFeature,
	FixedToolbarFeature,
	HeadingFeature,
	RelationshipFeature,
	type FeatureProviderServer,
} from "@payloadcms/richtext-lexical";
import type { Block } from "payload";
import { LangBlock } from "../plugins/blocks/LangBlock";

export const defaultWysiwygFeatures = ({
	defaultFeatures,
	blocks = [],
}: {
	defaultFeatures: FeatureProviderServer[];
	blocks?: Block[];
}) => {
	return [
		...defaultFeatures.filter(
			(feature) =>
				feature.key !== "checklist" &&
				feature.key !== "inlineCode" &&
				feature.key !== "indent" &&
				feature.key !== "blockquote",
		),
		EXPERIMENTAL_TableFeature(),
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
				"map-categories",
				"map-markers",
				"maps",
			],
		}),
		BlocksFeature({
			blocks,
			inlineBlocks: [LangBlock],
		}),
	];
};
