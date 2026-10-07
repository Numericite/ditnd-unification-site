import { createServerFeature } from "@payloadcms/richtext-lexical";

export const DuplicateBlockFeature = createServerFeature({
	feature: {
		ClientFeature:
			"./features/duplicateBlock/client#DuplicateBlockFeatureClient",
	},
	key: "duplicateBlock",
});
