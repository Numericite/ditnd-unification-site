import type { ReactNode } from "react";

// Restricted markdown renderer for LLM answers: paragraphs, lists, titles, bold,
// italic and inline code. Everything is built as React elements, so no LLM output
// ever reaches the DOM as HTML. Links are rendered as plain text: the model can
// hallucinate URLs, and the trusted links are already listed in the sources section.

const INLINE_SOURCE =
	/(\*\*|__)([\s\S]+?)\1|(\*|_)([^*_\n]+?)\3|`([^`]+)`|\[([^\]]+)\]\([^)]*\)/
		.source;

const HEADING = /^\s{0,3}(#{1,6})\s+(.*)$/;
const BULLET = /^(\s*)[-*•]\s+(.*)$/;
const ORDERED = /^(\s*)\d+[.)]\s+(.*)$/;

// Extra spaces required to treat an item as nested under the previous one.
const NESTED_INDENT = 2;

type ListItem = { text: string; children: ListBlock | null };
type ListBlock = { type: "list"; ordered: boolean; items: ListItem[] };

type Block =
	| { type: "paragraph"; lines: string[] }
	| { type: "heading"; text: string }
	| ListBlock;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
	const pattern = new RegExp(INLINE_SOURCE, "g");
	const nodes: ReactNode[] = [];
	let lastIndex = 0;
	let match = pattern.exec(text);

	while (match !== null) {
		if (match.index > lastIndex) {
			nodes.push(text.slice(lastIndex, match.index));
		}
		const key = `${keyPrefix}-${match.index}`;
		if (match[2] !== undefined) {
			nodes.push(<strong key={key}>{renderInline(match[2], key)}</strong>);
		} else if (match[4] !== undefined) {
			nodes.push(<em key={key}>{renderInline(match[4], key)}</em>);
		} else if (match[5] !== undefined) {
			nodes.push(<code key={key}>{match[5]}</code>);
		} else if (match[6] !== undefined) {
			nodes.push(<span key={key}>{renderInline(match[6], key)}</span>);
		}
		lastIndex = pattern.lastIndex;
		match = pattern.exec(text);
	}

	if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
	return nodes;
}

function parseBlocks(content: string): Block[] {
	const blocks: Block[] = [];
	let paragraph: string[] | null = null;
	// Open lists, from the outermost to the deepest. An item indented further than the
	// current level opens a nested list under the previous item.
	let openLists: { indent: number; list: ListBlock }[] = [];
	let blankSeen = false;

	const closeParagraph = () => {
		if (paragraph) blocks.push({ type: "paragraph", lines: paragraph });
		paragraph = null;
	};
	const closeLists = () => {
		const root = openLists[0];
		if (root) blocks.push(root.list);
		openLists = [];
	};

	for (const rawLine of content.replace(/\r\n/g, "\n").split("\n")) {
		const line = rawLine.trimEnd();

		if (line.trim() === "") {
			closeParagraph();
			// A blank line does not close a list: models routinely separate list items
			// with one. The list closes on the next non-item line instead.
			blankSeen = true;
			continue;
		}

		const heading = HEADING.exec(line);
		if (heading?.[2]) {
			closeParagraph();
			closeLists();
			blocks.push({ type: "heading", text: heading[2] });
			blankSeen = false;
			continue;
		}

		const bullet = BULLET.exec(line);
		const ordered = bullet ? null : ORDERED.exec(line);
		const text = bullet?.[2] ?? ordered?.[2];
		if (text !== undefined) {
			closeParagraph();
			const leading = bullet?.[1] ?? ordered?.[1] ?? "";
			const indent = leading.replace(/\t/g, "  ").length;
			const isOrdered = ordered !== null;

			while (
				openLists.length > 1 &&
				indent < (openLists[openLists.length - 1]?.indent ?? 0)
			) {
				openLists.pop();
			}

			let current = openLists[openLists.length - 1];
			const parentItem = current?.list.items[current.list.items.length - 1];

			if (!current) {
				const list: ListBlock = { type: "list", ordered: isOrdered, items: [] };
				current = { indent, list };
				openLists.push(current);
			} else if (indent >= current.indent + NESTED_INDENT && parentItem) {
				const list: ListBlock = { type: "list", ordered: isOrdered, items: [] };
				parentItem.children = list;
				current = { indent, list };
				openLists.push(current);
			} else if (current.list.ordered !== isOrdered) {
				// Sibling list of a different kind at the same level: start a new one.
				closeLists();
				const list: ListBlock = { type: "list", ordered: isOrdered, items: [] };
				current = { indent, list };
				openLists.push(current);
			}

			current.list.items.push({ text, children: null });
			blankSeen = false;
			continue;
		}

		const deepest = openLists[openLists.length - 1];
		const lastItem = deepest?.list.items[deepest.list.items.length - 1];
		if (lastItem && !blankSeen) {
			// Wrapped continuation of the current item.
			lastItem.text += ` ${line.trim()}`;
			continue;
		}

		closeLists();
		if (!paragraph) paragraph = [];
		paragraph.push(line.trim());
		blankSeen = false;
	}

	closeParagraph();
	closeLists();
	return blocks;
}

function renderList(list: ListBlock, key: string) {
	const items = list.items.map((item, index) => {
		const itemKey = `${key}-${index}`;
		return (
			<li key={itemKey}>
				{renderInline(item.text, itemKey)}
				{item.children && renderList(item.children, `${itemKey}-sub`)}
			</li>
		);
	});
	return list.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>;
}

const Markdown = ({ content }: { content: string }) => (
	<>
		{parseBlocks(content).map((block, index) => {
			const key = `block-${index}`;
			if (block.type === "heading") {
				return <h3 key={key}>{renderInline(block.text, key)}</h3>;
			}
			if (block.type === "paragraph") {
				return <p key={key}>{renderInline(block.lines.join(" "), key)}</p>;
			}
			return renderList(block, key);
		})}
	</>
);

export default Markdown;
