// Markdown subset → Lexical (Payload-flavour) converter.
//
// The simplified-content prompt instructs Albert to emit only:
//   ## h2, ### h3, paragraphs, - ul, 1. ol, **bold**, [text](url)
//
// This converter accepts that subset and is defensive: if the model
// slips in italics, code, blockquotes, headings outside h2/h3, etc.,
// we drop the formatting marker and keep the inner text, never the
// disallowed node.

const FORMAT_BOLD = 1;

type SerializedTextNode = {
	type: "text";
	version: 1;
	text: string;
	format: number;
	mode: "normal";
	detail: 0;
	style: "";
};

type SerializedLinkNode = {
	type: "link";
	version: 1;
	fields: {
		linkType: "custom";
		url: string;
		newTab: boolean;
	};
	direction: "ltr";
	format: "";
	indent: 0;
	children: SerializedTextNode[];
};

type InlineNode = SerializedTextNode | SerializedLinkNode;

type SerializedParagraphNode = {
	type: "paragraph";
	version: 1;
	direction: "ltr";
	format: "";
	indent: 0;
	textFormat: 0;
	textStyle: "";
	children: InlineNode[];
};

type SerializedHeadingNode = {
	type: "heading";
	tag: "h2" | "h3";
	version: 1;
	direction: "ltr";
	format: "";
	indent: 0;
	children: InlineNode[];
};

type SerializedListItemNode = {
	type: "listitem";
	value: number;
	version: 1;
	direction: "ltr";
	format: "";
	indent: 0;
	children: InlineNode[];
};

type SerializedListNode = {
	type: "list";
	listType: "bullet" | "number";
	tag: "ul" | "ol";
	start: 1;
	version: 1;
	direction: "ltr";
	format: "";
	indent: 0;
	children: SerializedListItemNode[];
};

type BlockNode =
	| SerializedParagraphNode
	| SerializedHeadingNode
	| SerializedListNode;

export type SerializedLexicalRoot = {
	root: {
		type: "root";
		version: 1;
		direction: "ltr";
		format: "";
		indent: 0;
		children: BlockNode[];
	};
};

function makeText(text: string, format = 0): SerializedTextNode {
	return {
		type: "text",
		version: 1,
		text,
		format,
		mode: "normal",
		detail: 0,
		style: "",
	};
}

function stripDisallowedInlineMarkers(text: string): string {
	// Drop markers for italic (*..* or _.._), strikethrough (~~..~~) and
	// inline code (`..`), keeping the inner text. We never call this on
	// a string that still has bold (**..**) markers — those are handled
	// up-stream.
	return text
		.replace(/`([^`\n]+)`/g, "$1")
		.replace(/~~([^~\n]+)~~/g, "$1")
		.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1$2")
		.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, "$1$2");
}

function parseBoldRuns(text: string): SerializedTextNode[] {
	const nodes: SerializedTextNode[] = [];
	const boldRegex = /\*\*([^*\n]+)\*\*/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null = boldRegex.exec(text);
	while (match !== null) {
		if (match.index > lastIndex) {
			const before = stripDisallowedInlineMarkers(
				text.slice(lastIndex, match.index),
			);
			if (before) nodes.push(makeText(before, 0));
		}
		const captured = match[1] ?? "";
		const inner = stripDisallowedInlineMarkers(captured);
		if (inner) nodes.push(makeText(inner, FORMAT_BOLD));
		lastIndex = match.index + match[0].length;
		match = boldRegex.exec(text);
	}
	if (lastIndex < text.length) {
		const rest = stripDisallowedInlineMarkers(text.slice(lastIndex));
		if (rest) nodes.push(makeText(rest, 0));
	}
	return nodes;
}

function parseInline(text: string): InlineNode[] {
	const nodes: InlineNode[] = [];
	const linkRegex = /\[([^\]\n]+)\]\(([^)\s]+)\)/g;
	let lastIndex = 0;
	let match: RegExpExecArray | null = linkRegex.exec(text);
	while (match !== null) {
		if (match.index > lastIndex) {
			nodes.push(...parseBoldRuns(text.slice(lastIndex, match.index)));
		}
		const linkText = match[1] ?? "";
		const url = match[2] ?? "";
		const children = parseBoldRuns(linkText);
		if (children.length > 0 && url) {
			nodes.push({
				type: "link",
				version: 1,
				fields: { linkType: "custom", url, newTab: false },
				direction: "ltr",
				format: "",
				indent: 0,
				children,
			});
		}
		lastIndex = match.index + match[0].length;
		match = linkRegex.exec(text);
	}
	if (lastIndex < text.length) {
		nodes.push(...parseBoldRuns(text.slice(lastIndex)));
	}
	return nodes;
}

function makeParagraph(text: string): SerializedParagraphNode | null {
	const children = parseInline(text.trim());
	if (children.length === 0) return null;
	return {
		type: "paragraph",
		version: 1,
		direction: "ltr",
		format: "",
		indent: 0,
		textFormat: 0,
		textStyle: "",
		children,
	};
}

function makeHeading(text: string, level: 2 | 3): SerializedHeadingNode | null {
	const children = parseInline(text.trim());
	if (children.length === 0) return null;
	return {
		type: "heading",
		tag: level === 2 ? "h2" : "h3",
		version: 1,
		direction: "ltr",
		format: "",
		indent: 0,
		children,
	};
}

function makeList(
	items: string[],
	kind: "bullet" | "number",
): SerializedListNode | null {
	const children: SerializedListItemNode[] = [];
	items.forEach((raw, idx) => {
		const inline = parseInline(raw.trim());
		if (inline.length === 0) return;
		children.push({
			type: "listitem",
			value: idx + 1,
			version: 1,
			direction: "ltr",
			format: "",
			indent: 0,
			children: inline,
		});
	});
	if (children.length === 0) return null;
	return {
		type: "list",
		listType: kind,
		tag: kind === "bullet" ? "ul" : "ol",
		start: 1,
		version: 1,
		direction: "ltr",
		format: "",
		indent: 0,
		children,
	};
}

const HEADING_RE = /^(#{1,6})\s+(.*)$/;
const UL_ITEM_RE = /^[-*+]\s+(.*)$/;
const OL_ITEM_RE = /^\d+\.\s+(.*)$/;
const BLOCKQUOTE_RE = /^>\s?(.*)$/;

function blockFromLines(lines: string[]): BlockNode | null {
	const firstLine = lines[0];
	if (!firstLine) return null;

	const firstHeading = HEADING_RE.exec(firstLine);
	if (firstHeading?.[1] && firstHeading[2] !== undefined) {
		// Headings are always single-line. Anything after is ignored;
		// the LLM should have split via \n\n anyway.
		const hashes = firstHeading[1].length;
		// Downgrade h1 → h2, clamp h4-h6 → h3 so we never violate the
		// whitelist even if the model breaks the rule.
		const level: 2 | 3 = hashes <= 2 ? 2 : 3;
		return makeHeading(firstHeading[2], level);
	}

	if (lines.every((l) => UL_ITEM_RE.test(l))) {
		const items = lines.map((l) => UL_ITEM_RE.exec(l)?.[1] ?? l);
		return makeList(items, "bullet");
	}

	if (lines.every((l) => OL_ITEM_RE.test(l))) {
		const items = lines.map((l) => OL_ITEM_RE.exec(l)?.[1] ?? l);
		return makeList(items, "number");
	}

	// Strip leading blockquote markers if present (defensive: prompt
	// forbids them but the model occasionally emits >). Treat as plain
	// paragraph.
	const paragraphText = lines
		.map((l) => BLOCKQUOTE_RE.exec(l)?.[1] ?? l)
		.join(" ");
	return makeParagraph(paragraphText);
}

export function markdownToLexical(markdown: string): SerializedLexicalRoot {
	const normalized = markdown.replace(/\r\n/g, "\n").trim();
	const blocks = normalized.split(/\n{2,}/);
	const children: BlockNode[] = [];

	for (const block of blocks) {
		const lines = block
			.split("\n")
			.map((l) => l.trim())
			.filter((l) => l.length > 0);
		if (lines.length === 0) continue;
		const node = blockFromLines(lines);
		if (node) children.push(node);
	}

	return {
		root: {
			type: "root",
			version: 1,
			direction: "ltr",
			format: "",
			indent: 0,
			children,
		},
	};
}
