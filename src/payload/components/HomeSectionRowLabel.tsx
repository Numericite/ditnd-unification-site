"use client";
import { useRowLabel } from "@payloadcms/ui";
import {
	HOME_SECTION_LABELS,
	type HomeSectionType,
} from "~/payload/globals/cms/homeSectionLabels";

export default function HomeSectionRowLabel() {
	const { data, rowNumber } = useRowLabel<{
		blockType?: HomeSectionType;
		visible?: boolean | null;
	}>();

	const position = String((rowNumber ?? 0) + 1).padStart(2, "0");
	const label = data.blockType ? HOME_SECTION_LABELS[data.blockType] : "";

	return (
		<span>
			{position} · {label}
			{data.visible === false && (
				<span style={{ opacity: 0.6 }}> — masquée</span>
			)}
		</span>
	);
}
