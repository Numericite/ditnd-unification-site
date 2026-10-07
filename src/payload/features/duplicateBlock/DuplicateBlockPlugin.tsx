"use client";

import type { PluginComponentWithAnchor } from "@payloadcms/richtext-lexical";
import {
	$getNodeByKey,
	$getRoot,
	$getSelection,
	COMMAND_PRIORITY_EDITOR,
	KEY_DOWN_COMMAND,
	type LexicalEditor,
} from "@payloadcms/richtext-lexical/lexical";
import { useLexicalComposerContext } from "@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext";
import { IS_APPLE } from "@payloadcms/richtext-lexical/lexical/utils";
import { CopyIcon } from "@payloadcms/ui";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./DuplicateBlockPlugin.module.css";
import { $getSelectedBlocks, $insertCopiesAfter } from "./duplicateNodes";

const HANDLE_CLASSNAME = "draggable-block-menu";
const SHORTCUT_LABEL = IS_APPLE ? "⌘D" : "Ctrl+D";

type MenuState = {
	handle: HTMLElement;
	left: number;
	nodeKey: string;
	top: number;
};

function isDuplicateShortcut(event: KeyboardEvent) {
	return (
		event.key.toLowerCase() === "d" &&
		!event.shiftKey &&
		!event.altKey &&
		(IS_APPLE
			? event.metaKey && !event.ctrlKey
			: event.ctrlKey && !event.metaKey)
	);
}

function getOwnHandle(target: EventTarget | null, anchorElem: HTMLElement) {
	const handle =
		target instanceof Element ? target.closest(`.${HANDLE_CLASSNAME}`) : null;
	return handle instanceof HTMLElement && handle.parentElement === anchorElem
		? handle
		: null;
}

function findTopLevelKeyAt(editor: LexicalEditor, y: number) {
	const keys = editor.getEditorState().read(() => $getRoot().getChildrenKeys());
	let closest: { distance: number; key: string } | null = null;
	for (const key of keys) {
		const rect = editor.getElementByKey(key)?.getBoundingClientRect();
		if (!rect) continue;
		const distance = Math.max(rect.top - y, y - rect.bottom, 0);
		if (!closest || distance < closest.distance) {
			closest = { distance, key };
		}
	}
	return closest?.key ?? null;
}

export const DuplicateBlockPlugin: PluginComponentWithAnchor = ({
	anchorElem,
}) => {
	const [editor] = useLexicalComposerContext();
	const menuRef = useRef<HTMLDivElement>(null);
	const [menu, setMenu] = useState<MenuState | null>(null);

	useEffect(
		() =>
			editor.registerCommand(
				KEY_DOWN_COMMAND,
				(event) => {
					if (
						!isDuplicateShortcut(event) ||
						!(event.target instanceof HTMLElement) ||
						!event.target.isContentEditable
					) {
						return false;
					}
					const selection = $getSelection();
					if (!selection) return false;
					const blocks = $getSelectedBlocks(selection.getNodes());
					if (blocks.length === 0) return false;
					event.preventDefault();
					$insertCopiesAfter(blocks);
					return true;
				},
				COMMAND_PRIORITY_EDITOR,
			),
		[editor],
	);

	useEffect(() => {
		function onClick(event: MouseEvent) {
			const handle = getOwnHandle(event.target, anchorElem);
			if (!handle || !editor.isEditable()) return;
			const handleRect = handle.getBoundingClientRect();
			const nodeKey = findTopLevelKeyAt(
				editor,
				handleRect.top + handleRect.height / 2,
			);
			if (!nodeKey) return;
			const anchorRect = anchorElem.getBoundingClientRect();
			setMenu((current) =>
				current?.nodeKey === nodeKey
					? null
					: {
							handle,
							left: handleRect.left - anchorRect.left,
							nodeKey,
							top: handleRect.bottom - anchorRect.top + 4,
						},
			);
		}
		function onDragStart() {
			setMenu(null);
		}
		anchorElem.addEventListener("click", onClick);
		anchorElem.addEventListener("dragstart", onDragStart);
		return () => {
			anchorElem.removeEventListener("click", onClick);
			anchorElem.removeEventListener("dragstart", onDragStart);
		};
	}, [anchorElem, editor]);

	useEffect(() => {
		if (!menu) return;
		menuRef.current?.querySelector("button")?.focus({ preventScroll: true });
		function onMouseDown(event: MouseEvent) {
			if (
				(event.target instanceof Node &&
					menuRef.current?.contains(event.target)) ||
				getOwnHandle(event.target, anchorElem)
			) {
				return;
			}
			setMenu(null);
		}
		document.addEventListener("mousedown", onMouseDown);
		return () => document.removeEventListener("mousedown", onMouseDown);
	}, [menu, anchorElem]);

	if (!menu) return null;

	function duplicate() {
		if (!menu) return;
		editor.update(() => {
			const node = $getNodeByKey(menu.nodeKey);
			if (node) $insertCopiesAfter([node]);
		});
		setMenu(null);
	}

	return createPortal(
		<div
			aria-label="Actions sur le bloc"
			className={styles.menu}
			onKeyDown={(event) => {
				if (event.key !== "Escape") return;
				event.stopPropagation();
				menu.handle.focus();
				setMenu(null);
			}}
			ref={menuRef}
			role="menu"
			style={{ left: menu.left, top: menu.top }}
		>
			<button
				className={styles.item}
				onClick={duplicate}
				role="menuitem"
				type="button"
			>
				<span className={styles.icon} aria-hidden>
					<CopyIcon />
				</span>
				<span className={styles.label}>Dupliquer</span>
				<kbd className={styles.shortcut}>{SHORTCUT_LABEL}</kbd>
			</button>
		</div>,
		anchorElem,
	);
};
