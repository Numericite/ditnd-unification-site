import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import {
	defaultJSXConverters,
	RichText,
} from "@payloadcms/richtext-lexical/react";
import {
	accordionConverter,
	customImageSizeConverter,
	headingConverter,
	linkConverter,
	quoteConverter,
	relationshipConverter,
	tableConverter,
	uploadConverter,
	youtubeConverter,
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
				quote: quoteConverter,
				blocks: {
					accordion: accordionConverter,
					image: customImageSizeConverter,
					youtube: youtubeConverter,
				},
				link: linkConverter,
				table: tableConverter,
			}}
		/>
	);
}
