import Accordion from "@codegouvfr/react-dsfr/Accordion";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { useState } from "react";
import { RichTextRenderer } from "./RichTextRenderer";

export default function WysiwygAccordion({
	title,
	content,
}: {
	title: string;
	content: DefaultTypedEditorState;
}) {
	const [expanded, setExpanded] = useState(false);

	return (
		<Accordion
			label={title}
			onExpandedChange={(value) => setExpanded(!value)}
			expanded={expanded}
		>
			<RichTextRenderer content={content} />
		</Accordion>
	);
}
