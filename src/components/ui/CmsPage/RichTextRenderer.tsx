import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getConverters } from "~/utils/converters";

export function RichTextRenderer({
	content,
}: {
	content: DefaultTypedEditorState;
}) {
	return (
		<RichText
			className="payload-richtext"
			data={content}
			converters={getConverters()}
		/>
	);
}
