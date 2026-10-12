import {
	$findMatchingParent,
	$isDecoratorNode,
	$isElementNode,
	$isRootNode,
	$isRootOrShadowRoot,
	$parseSerializedNode,
	type LexicalNode,
	type SerializedElementNode,
	type SerializedLexicalNode,
} from "@payloadcms/richtext-lexical/lexical";
import ObjectID from "bson-objectid";

type SerializedNodeWithIds = SerializedLexicalNode & {
	children?: SerializedNodeWithIds[];
	fields?: { id?: string };
	id?: string;
};

function $exportNodeDeep(node: LexicalNode): SerializedLexicalNode {
	const serialized = node.exportJSON();
	if ($isElementNode(node)) {
		(serialized as SerializedElementNode).children = node
			.getChildren()
			.map($exportNodeDeep);
	}
	return serialized;
}

// Same id renewal as Payload's ClipboardPlugin, so a duplicated block gets
// its own form state instead of sharing the original's.
function renewIds(node: SerializedNodeWithIds) {
	if (node.fields && typeof node.fields === "object" && "id" in node.fields) {
		node.fields.id = ObjectID().toHexString();
	} else if ("id" in node) {
		node.id = ObjectID().toHexString();
	}
	for (const child of node.children ?? []) {
		renewIds(child);
	}
}

function $copyNodeDeep(node: LexicalNode) {
	const serialized: SerializedNodeWithIds = JSON.parse(
		JSON.stringify($exportNodeDeep(node)),
	);
	renewIds(serialized);
	return $parseSerializedNode(serialized);
}

export function $insertCopiesAfter(nodes: LexicalNode[]) {
	let previous = nodes.at(-1);
	if (!previous) return;
	for (const node of nodes) {
		const copy = $copyNodeDeep(node);
		previous.insertAfter(copy);
		previous = copy;
	}
}

function $getBlock(node: LexicalNode) {
	return $findMatchingParent(
		node,
		(candidate) =>
			($isElementNode(candidate) || $isDecoratorNode(candidate)) &&
			!candidate.isInline() &&
			!$isRootOrShadowRoot(candidate),
	);
}

export function $getSelectedBlocks(nodes: LexicalNode[]) {
	const blocks = new Map<string, LexicalNode>();
	for (const node of nodes) {
		const block = $getBlock(node);
		if (block) blocks.set(block.getKey(), block);
	}
	const outermost = [...blocks.values()].filter(
		(block) =>
			!block.getParents().some((parent) => blocks.has(parent.getKey())),
	);
	const parent = outermost[0]?.getParent();
	if (outermost.every((block) => block.getParent()?.is(parent))) {
		return outermost;
	}
	const rootChildren = new Map<string, LexicalNode>();
	for (const block of outermost) {
		const rootChild = $findMatchingParent(block, (candidate) =>
			$isRootNode(candidate.getParent()),
		);
		if (rootChild) rootChildren.set(rootChild.getKey(), rootChild);
	}
	return [...rootChildren.values()];
}
