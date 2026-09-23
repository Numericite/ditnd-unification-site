import Accordion from "@codegouvfr/react-dsfr/Accordion";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { RichTextRenderer } from "./RichTextRenderer";

export default function WysiwygAccordion({
	title,
	content,
}: {
	title: string;
	content: DefaultTypedEditorState;
}) {
	return (
		<Accordion label={title}>
			<RichTextRenderer content={content} />
		</Accordion>
	);
}
