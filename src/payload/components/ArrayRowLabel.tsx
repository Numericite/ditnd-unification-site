"use client";
import { useRowLabel } from "@payloadcms/ui";

const ArrayRowLabel = () => {
	const { data, rowNumber } = useRowLabel<{ title?: string }>();

	const position = String((rowNumber ?? 0) + 1).padStart(2, "0");

	return <span>{data?.title || `Élément ${position}`}</span>;
};

export default ArrayRowLabel;
