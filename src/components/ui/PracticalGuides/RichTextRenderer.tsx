import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import {
	defaultJSXConverters,
	RichText,
} from "@payloadcms/richtext-lexical/react";
import {
	accordionConverter,
	customImageSizeConverter,
	headingConverter,
	relationshipConverter,
	uploadConverter,
} from "~/utils/converters";

export function RichTextRenderer({
	content,
}: {
	content: DefaultTypedEditorState;
}) {
	return (
		<RichText
			data={content}
			converters={{
				...defaultJSXConverters,
				heading: headingConverter,
				relationship: relationshipConverter,
				upload: uploadConverter,
				blocks: {
					accordion: accordionConverter,
					image: customImageSizeConverter,
				},
			}}
		/>
	);
}
