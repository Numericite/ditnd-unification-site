"use client";
import { useRowLabel } from "@payloadcms/ui";
import { useEffect, useState } from "react";

type ConditionRef = number | { id: number; acronym?: string } | null;

export default function ConditionTextRowLabel() {
	const { data, rowNumber } = useRowLabel<{
		condition?: ConditionRef;
		title?: string;
	}>();

	const condition = data?.condition;
	const conditionId = typeof condition === "object" ? condition?.id : condition;
	const [acronym, setAcronym] = useState<string | null>(
		typeof condition === "object" ? (condition?.acronym ?? null) : null,
	);

	useEffect(() => {
		if (!conditionId) {
			setAcronym(null);
			return;
		}

		let cancelled = false;

		fetch(`/api/conditions/${conditionId}?depth=0&select[acronym]=true`)
			.then((r) => (r.ok ? r.json() : null))
			.then((doc) => {
				if (!cancelled) setAcronym(doc?.acronym ?? null);
			})
			.catch(() => {});

		return () => {
			cancelled = true;
		};
	}, [conditionId]);

	const position = String((rowNumber ?? 0) + 1).padStart(2, "0");

	return (
		<span>
			{acronym ?? `Trouble ${position}`}
			{data?.title && <span style={{ opacity: 0.6 }}> — {data.title}</span>}
		</span>
	);
}
