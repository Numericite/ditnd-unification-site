type LexicalNode = Record<string, unknown>;
type Child = string | LexicalNode;

export const TEXT_FORMAT = {
	bold: 1,
	italic: 2,
	strikethrough: 4,
	underline: 8,
} as const;

const objectId = () =>
	Array.from({ length: 24 }, () =>
		Math.floor(Math.random() * 16).toString(16),
	).join("");

export const text = (value: string, format = 0): LexicalNode => ({
	type: "text",
	text: value,
	format,
	detail: 0,
	mode: "normal",
	style: "",
	version: 1,
});

const toNodes = (children: Child[]) =>
	children.map((child) => (typeof child === "string" ? text(child) : child));

export const paragraph = (...children: Child[]): LexicalNode => ({
	type: "paragraph",
	format: "",
	indent: 0,
	version: 1,
	direction: null,
	textFormat: 0,
	textStyle: "",
	children: toNodes(children),
});

export const heading = (
	tag: "h2" | "h3" | "h4" | "h5" | "h6",
	value: string,
): LexicalNode => ({
	type: "heading",
	tag,
	format: "",
	indent: 0,
	version: 1,
	direction: null,
	children: [text(value)],
});

export const list = (tag: "ul" | "ol", items: Child[][]): LexicalNode => ({
	type: "list",
	tag,
	listType: tag === "ul" ? "bullet" : "number",
	start: 1,
	format: "",
	indent: 0,
	version: 1,
	direction: null,
	children: items.map((children, index) => ({
		type: "listitem",
		value: index + 1,
		format: "",
		indent: 0,
		version: 1,
		direction: null,
		children: toNodes(children),
	})),
});

export const link = (
	value: string,
	fields: Record<string, unknown>,
): LexicalNode => ({
	type: "link",
	version: 3,
	format: "",
	indent: 0,
	direction: null,
	id: objectId(),
	fields: { newTab: false, ...fields },
	children: [text(value)],
});

export const horizontalRule = (): LexicalNode => ({
	type: "horizontalrule",
	version: 1,
});

export const upload = (mediaId: number): LexicalNode => ({
	type: "upload",
	version: 3,
	format: "",
	id: objectId(),
	fields: null,
	relationTo: "medias",
	value: mediaId,
});

export const relationship = (
	relationTo: "practical-guides" | "courses",
	id: number,
): LexicalNode => ({
	type: "relationship",
	version: 2,
	format: "",
	relationTo,
	value: id,
});

export const table = (rows: string[][]): LexicalNode => ({
	type: "table",
	version: 1,
	format: "",
	indent: 0,
	direction: null,
	children: rows.map((cells, rowIndex) => ({
		type: "tablerow",
		version: 1,
		format: "",
		indent: 0,
		direction: null,
		children: cells.map((cell) => ({
			type: "tablecell",
			version: 1,
			format: "",
			indent: 0,
			direction: null,
			colSpan: 1,
			rowSpan: 1,
			headerState: rowIndex === 0 ? 1 : 0,
			children: [paragraph(cell)],
		})),
	})),
});

export const block = (
	blockType: string,
	fields: Record<string, unknown>,
): LexicalNode => ({
	type: "block",
	version: 2,
	format: "",
	fields: { id: objectId(), blockName: "", blockType, ...fields },
});

export const inlineBlock = (
	blockType: string,
	fields: Record<string, unknown>,
): LexicalNode => ({
	type: "inlineBlock",
	version: 1,
	fields: { id: objectId(), blockName: "", blockType, ...fields },
});

export const richText = (...children: LexicalNode[]) => ({
	root: {
		type: "root",
		format: "",
		indent: 0,
		version: 1,
		direction: null,
		children,
	},
});

export const accordion = (
	openMode: "single" | "multiple",
	items: { title: string; children: LexicalNode[] }[],
) =>
	block("accordion", {
		openMode,
		items: items.map((item) => ({
			id: objectId(),
			title: item.title,
			content: richText(...item.children),
		})),
	});
