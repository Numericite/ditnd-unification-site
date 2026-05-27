// Lexical (Payload-flavour) → markdown serializer.
//
// Used as INPUT for the simplification LLM: we strip the rich blocks
// (Accordion, CustomImage, Callout, YouTube, Citation, Highlight) but
// recurse into their inner text so the model sees the full meaning of
// the source fiche. The output uses only the markdown constructs the
// simplification prompt allows (h2/h3, paragraphs, lists, bold, links),
// so the LLM is in-domain on both sides.

const FORMAT_BOLD = 1;

type LexicalNode = Record<string, unknown>;

function isObject(value: unknown): value is LexicalNode {
	return !!value && typeof value === "object";
}

function inlineNodeToMarkdown(node: unknown): string {
	if (!isObject(node)) return "";

	if (node.type === "text") {
		const text = typeof node.text === "string" ? node.text : "";
		const format = typeof node.format === "number" ? node.format : 0;
		if (!text) return "";
		// Bold is the only inline format we propagate. Italics/underline
		// from the source are flattened to plain text on purpose: the FALC
		// guidelines discourage them, and we don't want the LLM to mirror
		// them in its output.
		if ((format & FORMAT_BOLD) === FORMAT_BOLD) return `**${text}**`;
		return text;
	}

	if (node.type === "link") {
		const fields = isObject(node.fields) ? node.fields : undefined;
		const url = typeof fields?.url === "string" ? fields.url : "";
		const inner = inlineChildrenToMarkdown(node.children);
		if (!url || !inner) return inner;
		return `[${inner}](${url})`;
	}

	if (node.type === "linebreak") return " ";

	// Autolink / custom inline blocks: dig into children if any.
	if (Array.isArray(node.children)) {
		return inlineChildrenToMarkdown(node.children);
	}

	return "";
}

function inlineChildrenToMarkdown(children: unknown): string {
	if (!Array.isArray(children)) return "";
	return children.map(inlineNodeToMarkdown).join("");
}

function blockNodeToMarkdown(node: unknown): string {
	if (!isObject(node)) return "";

	if (node.type === "paragraph") {
		return inlineChildrenToMarkdown(node.children).trim();
	}

	if (node.type === "heading") {
		const tag = typeof node.tag === "string" ? node.tag : "h2";
		const level = Number.parseInt(tag.replace(/[^\d]/g, ""), 10) || 2;
		const hashes = "#".repeat(Math.min(Math.max(level, 1), 6));
		const text = inlineChildrenToMarkdown(node.children).trim();
		if (!text) return "";
		return `${hashes} ${text}`;
	}

	if (node.type === "list") {
		const listType = node.listType === "number" ? "number" : "bullet";
		const items = Array.isArray(node.children) ? node.children : [];
		const rendered = items
			.map((item, idx) => {
				const text = blockNodeToMarkdown(item).trim();
				if (!text) return "";
				const prefix = listType === "number" ? `${idx + 1}.` : "-";
				return `${prefix} ${text}`;
			})
			.filter(Boolean);
		return rendered.join("\n");
	}

	if (node.type === "listitem") {
		// Listitem content is inline by default; if it nests a list or a
		// paragraph, recurse so we don't lose anything.
		return inlineChildrenToMarkdown(node.children).trim();
	}

	if (node.type === "quote") {
		const text = inlineChildrenToMarkdown(node.children).trim();
		return text ? `> ${text}` : "";
	}

	if (node.type === "block") {
		// Custom Payload block (Accordion, Callout, Citation, CustomImage,
		// YouTube, Highlight…). We don't preserve the block container, but
		// we recurse into its fields to recover the inner text and rich
		// content the editor wrote.
		const fields = isObject(node.fields) ? node.fields : undefined;
		if (!fields) return "";
		const parts: string[] = [];
		for (const [key, value] of Object.entries(fields)) {
			if (key === "blockType" || key === "id" || key === "blockName") continue;
			if (typeof value === "string" && value.trim().length > 0) {
				parts.push(value.trim());
				continue;
			}
			if (isObject(value) && isObject(value.root)) {
				const inner = blockNodeToMarkdown(value.root);
				if (inner) parts.push(inner);
			}
		}
		return parts.join("\n\n");
	}

	if (node.type === "root") {
		const children = Array.isArray(node.children) ? node.children : [];
		return children
			.map(blockNodeToMarkdown)
			.map((s) => s.trim())
			.filter(Boolean)
			.join("\n\n");
	}

	// Fallback for unknown structural nodes: drop the wrapper, keep text.
	if (Array.isArray(node.children)) {
		return blockNodeToMarkdown({ type: "root", children: node.children });
	}

	return "";
}

export function lexicalToMarkdown(content: unknown): string {
	if (!isObject(content)) return "";
	const root = isObject(content.root) ? content.root : content;
	return blockNodeToMarkdown(root).trim();
}
