// Markdown subset → Lexical (Payload-flavour) converter.
//
// The simplified-content prompt instructs Albert to emit only:
//   ## h2, ### h3, paragraphs, - ul, 1. ol, **bold**, [text](url)
//   and <accordeon>/<titre> tags, rebuilt as accordion blocks.
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

type SerializedAccordionNode = {
	type: "block";
	version: 2;
	format: "";
	fields: {
		id: string;
		blockName: "";
		blockType: "accordion";
		openMode: "single" | "multiple";
		items: { id: string; title: string; content: SerializedLexicalRoot }[];
	};
};

type RootChildNode = BlockNode | SerializedAccordionNode;

export type SerializedLexicalRoot = {
	root: {
		type: "root";
		version: 1;
		direction: "ltr";
		format: "";
		indent: 0;
		children: RootChildNode[];
	};
};

// Same shape as the ids Payload gives to blocks and array rows.
function objectId(): string {
	return Array.from({ length: 24 }, () =>
		Math.floor(Math.random() * 16).toString(16),
	).join("");
}

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
	return (
		text
			.replace(/`([^`\n]+)`/g, "$1")
			.replace(/~~([^~\n]+)~~/g, "$1")
			.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1$2")
			.replace(/(^|[^_\w])_([^_\n]+)_(?![_\w])/g, "$1$2")
			// Unbalanced markers left over once the pairs are consumed.
			.replace(/\*\*|__|~~|`/g, "")
			// Backslash escapes (\*, \#, \_…) show the bare character.
			.replace(/\\([\\`*_{}[\]()#+\-.!>|~])/g, "$1")
			// Stray HTML-like tags (<br>, <titre>…).
			.replace(/<\/?[a-zA-Zéè][^<>]*>/g, " ")
			.replace(/ {2,}/g, " ")
	);
}

function cleanInlineText(text: string): string {
	return stripDisallowedInlineMarkers(text.replace(/\*\*/g, "")).trim();
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

function parseInline(rawText: string): InlineNode[] {
	const nodes: InlineNode[] = [];
	const text = rawText
		// Images are forbidden: keep their alt text only.
		.replace(/!\[([^\]\n]*)\]\([^)\s]*\)/g, "$1")
		// Autolinks <https://…> become regular links.
		.replace(/<(https?:\/\/[^>\s]+)>/g, "[$1]($1)")
		// __bold__ is read like **bold**.
		.replace(/__([^_\n]+)__/g, "**$1**");
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
const UL_ITEM_RE = /^[-*+•]\s+(.*)$/;
const OL_ITEM_RE = /^\d+[.)]\s+(.*)$/;
const BLOCKQUOTE_RE = /^>\s?(.*)$/;
const CODE_FENCE_RE = /^(`{3,}|~{3,})/;
const HORIZONTAL_RULE_RE = /^([-*_])(\s*\1){2,}$/;
const TABLE_SEPARATOR_RE = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/;
const TABLE_ROW_RE = /^\|(.*)\|$/;
const ACCORDION_OPEN_RE =
	/^<accord[eé]on(?:\s+mode=["']?(single|multiple)["']?)?\s*>$/i;
const ACCORDION_CLOSE_RE = /^<\/accord[eé]on\s*>$/i;
const ACCORDION_TITLE_RE = /^<titre>(.*)<\/titre>$/i;

// Line-based parser: a list, heading or paragraph ends as soon as a line of
// another kind starts, even without a blank line in between, so a list
// glued to a paragraph never leaks its "- " markers as raw text.
function parseBlocks(lines: string[]): BlockNode[] {
	const blocks: BlockNode[] = [];
	let paragraph: string[] = [];
	// Assigned from closures: the cast stops TS from narrowing it to `null`.
	let list = null as { kind: "bullet" | "number"; items: string[] } | null;

	const push = (node: BlockNode | null) => {
		if (node) blocks.push(node);
	};
	const flushParagraph = () => {
		if (paragraph.length > 0) push(makeParagraph(paragraph.join(" ")));
		paragraph = [];
	};
	const flushList = () => {
		if (list) push(makeList(list.items, list.kind));
		list = null;
	};
	const flush = () => {
		flushParagraph();
		flushList();
	};
	const addListItem = (kind: "bullet" | "number", text: string) => {
		flushParagraph();
		if (list && list.kind !== kind) flushList();
		list ??= { kind, items: [] };
		list.items.push(text);
	};

	for (const rawLine of lines) {
		let line = rawLine.trim();
		if (!line) {
			flush();
			continue;
		}
		if (
			CODE_FENCE_RE.test(line) ||
			TABLE_SEPARATOR_RE.test(line) ||
			HORIZONTAL_RULE_RE.test(line) ||
			ACCORDION_OPEN_RE.test(line) ||
			ACCORDION_CLOSE_RE.test(line)
		) {
			flush();
			continue;
		}

		const quote = BLOCKQUOTE_RE.exec(line);
		if (quote) line = (quote[1] ?? "").trim();
		const tableRow = TABLE_ROW_RE.exec(line);
		if (tableRow) {
			line = (tableRow[1] ?? "")
				.split("|")
				.map((cell) => cell.trim())
				.filter(Boolean)
				.join(" : ");
		}
		if (!line) continue;

		// A stray <titre> outside an accordion still reads as a title.
		const title = ACCORDION_TITLE_RE.exec(line);
		const heading = HEADING_RE.exec(line);
		if (title || heading) {
			flush();
			// Downgrade h1 → h2, clamp h4-h6 → h3 so we never violate the
			// whitelist even if the model breaks the rule.
			const level: 2 | 3 = heading && (heading[1] ?? "").length <= 2 ? 2 : 3;
			push(makeHeading((title ? title[1] : heading?.[2]) ?? "", level));
			continue;
		}

		const bullet = UL_ITEM_RE.exec(line);
		const ordered = OL_ITEM_RE.exec(line);
		// Nested lists are not allowed: an indented sub-item is folded into
		// the text of its parent item so the item count stays the same.
		const parentIndex = (list?.items.length ?? 0) - 1;
		if (
			list &&
			parentIndex >= 0 &&
			(bullet || ordered) &&
			/^\s{2,}/.test(rawLine)
		) {
			list.items[parentIndex] += ` ${(bullet ?? ordered)?.[1] ?? ""}`;
			continue;
		}
		if (bullet) {
			addListItem("bullet", bullet[1] ?? "");
			continue;
		}
		if (ordered) {
			addListItem("number", ordered[1] ?? "");
			continue;
		}

		flushList();
		paragraph.push(line);
	}

	flush();
	return blocks;
}

function makeAccordion(
	openMode: "single" | "multiple",
	items: { title: string; lines: string[] }[],
): SerializedAccordionNode | null {
	const accordionItems = items
		.map((item) => ({
			id: objectId(),
			title: cleanInlineText(item.title),
			content: makeRoot(parseBlocks(item.lines)),
		}))
		.filter((item) => item.title || item.content.root.children.length > 0);
	if (accordionItems.length === 0) return null;
	return {
		type: "block",
		version: 2,
		format: "",
		fields: {
			id: objectId(),
			blockName: "",
			blockType: "accordion",
			openMode,
			items: accordionItems,
		},
	};
}

function makeRoot(children: RootChildNode[]): SerializedLexicalRoot {
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

export function markdownToLexical(markdown: string): SerializedLexicalRoot {
	const lines = markdown.replace(/\r\n/g, "\n").split("\n");
	const children: RootChildNode[] = [];
	let pending: string[] = [];

	const flushPending = () => {
		children.push(...parseBlocks(pending));
		pending = [];
	};

	let index = 0;
	while (index < lines.length) {
		const line = (lines[index] ?? "").trim();
		const open = ACCORDION_OPEN_RE.exec(line);
		if (!open) {
			pending.push(lines[index] ?? "");
			index++;
			continue;
		}

		flushPending();
		index++;
		const items: { title: string; lines: string[] }[] = [];
		// Text before the first title can't belong to an item: it is kept
		// as regular content in front of the accordion.
		const preamble: string[] = [];
		// A missing closing tag (truncated answer) ends the accordion at the
		// end of the document.
		while (index < lines.length) {
			const rawInner = lines[index] ?? "";
			const inner = rawInner.trim();
			index++;
			if (ACCORDION_CLOSE_RE.test(inner)) break;
			const title = ACCORDION_TITLE_RE.exec(inner);
			if (title) {
				items.push({ title: title[1] ?? "", lines: [] });
			} else if (items.length > 0) {
				items[items.length - 1]?.lines.push(rawInner);
			} else {
				preamble.push(rawInner);
			}
		}
		children.push(...parseBlocks(preamble));
		const accordion = makeAccordion(
			open[1]?.toLowerCase() === "multiple" ? "multiple" : "single",
			items,
		);
		if (accordion) children.push(accordion);
	}
	flushPending();

	return makeRoot(children);
}
