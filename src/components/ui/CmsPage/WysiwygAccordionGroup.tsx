import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import WysiwygAccordion from "./WysiwygAccordion";

const TOGGLE_SELECTOR =
	":scope > .fr-accordion > .fr-accordion__title > .fr-accordion__btn";

export default function WysiwygAccordionGroup({
	items,
	openMode,
}: {
	items: { title: string; content: DefaultTypedEditorState }[];
	openMode?: string;
}) {
	const isMultiple = openMode === "multiple";
	const groupRef = useRef<HTMLDivElement>(null);
	const [allExpanded, setAllExpanded] = useState(false);

	const getToggles = useCallback(
		() =>
			Array.from(
				groupRef.current?.querySelectorAll<HTMLButtonElement>(
					TOGGLE_SELECTOR,
				) ?? [],
			),
		[],
	);

	useEffect(() => {
		const group = groupRef.current;
		if (!isMultiple || !group) return;

		const sync = () => {
			const toggles = getToggles();
			setAllExpanded(
				toggles.length > 0 &&
					toggles.every(
						(toggle) => toggle.getAttribute("aria-expanded") === "true",
					),
			);
		};

		sync();

		const observer = new MutationObserver(sync);
		observer.observe(group, {
			subtree: true,
			attributes: true,
			attributeFilter: ["aria-expanded"],
		});

		return () => observer.disconnect();
	}, [isMultiple, getToggles]);

	const toggleAll = () => {
		const shouldExpand = !allExpanded;
		for (const toggle of getToggles()) {
			if ((toggle.getAttribute("aria-expanded") === "true") !== shouldExpand) {
				toggle.click();
			}
		}
	};

	return (
		<div className={fr.cx("fr-my-3v")}>
			{isMultiple && (
				<div className={fr.cx("fr-mb-1w")} style={{ textAlign: "right" }}>
					<Button
						size="small"
						priority="tertiary no outline"
						iconId={
							allExpanded
								? "fr-icon-arrow-up-s-line"
								: "fr-icon-arrow-down-s-line"
						}
						iconPosition="right"
						onClick={toggleAll}
					>
						{allExpanded ? "Tout replier" : "Tout déplier"}
					</Button>
				</div>
			)}
			<div
				ref={groupRef}
				className={fr.cx("fr-accordions-group")}
				data-fr-group={isMultiple ? "false" : undefined}
			>
				{items.map((item, index) => (
					<WysiwygAccordion
						key={`${item.title}-${index}`}
						title={item.title}
						content={item.content}
					/>
				))}
			</div>
		</div>
	);
}
