"use client";

import { createClientFeature } from "@payloadcms/richtext-lexical/client";
import { DuplicateBlockPlugin } from "./DuplicateBlockPlugin";

export const DuplicateBlockFeatureClient = createClientFeature({
	plugins: [
		{ Component: DuplicateBlockPlugin, position: "floatingAnchorElem" },
	],
});
