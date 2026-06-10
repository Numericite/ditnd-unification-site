"use client";

import {
	FieldDescription,
	FieldLabel,
	useField,
	useFormFields,
} from "@payloadcms/ui";
import { useEffect, useState } from "react";

type FilterableDef = {
	categoryId: number;
	categoryName: string;
	key: string;
	label: string;
	fieldType: "checkbox" | "select";
};

type AllowedFilter = {
	categoryId: number;
	key: string;
};

function extractId(v: unknown): number | null {
	if (typeof v === "number") return v;
	if (typeof v === "object" && v !== null) {
		if ("id" in v && typeof (v as { id: unknown }).id === "number")
			return (v as { id: number }).id;
		if ("value" in v) {
			const inner = (v as { value: unknown }).value;
			if (typeof inner === "number") return inner;
			if (
				typeof inner === "object" &&
				inner !== null &&
				"id" in inner &&
				typeof (inner as { id: unknown }).id === "number"
			)
				return (inner as { id: number }).id;
		}
	}
	return null;
}

export default function CustomFieldFiltersEditor({
	path,
	field,
}: {
	path: string;
	field: { label?: unknown; admin?: { description?: string } };
}) {
	const { value, setValue } = useField<AllowedFilter[] | null>({ path });
	const rawCategoriesValue = useFormFields(
		([fields]) => fields.categories?.value,
	);
	const [available, setAvailable] = useState<FilterableDef[]>([]);

	const categoryIds = (
		rawCategoriesValue == null
			? []
			: Array.isArray(rawCategoriesValue)
				? rawCategoriesValue
						.map(extractId)
						.filter((id): id is number => id !== null)
				: []
	).sort();

	const categoryIdsStr = JSON.stringify(categoryIds);

	useEffect(() => {
		if (categoryIds.length === 0) {
			setAvailable([]);
			return;
		}
		Promise.all(
			categoryIds.map((id) =>
				fetch(`/api/map-categories/${id}?depth=0`)
					.then((r) => (r.ok ? r.json() : null))
					.catch(() => null),
			),
		).then((results) => {
			const filters: FilterableDef[] = [];
			for (const cat of results) {
				if (!cat || !Array.isArray(cat.customFields)) continue;
				for (const f of cat.customFields) {
					if (f.type !== "checkbox" && f.type !== "select") continue;
					filters.push({
						categoryId: cat.id,
						categoryName: cat.name,
						key: f.key,
						label: f.label,
						fieldType: f.type,
					});
				}
			}
			setAvailable(filters);
		});
	}, [categoryIdsStr]);

	const enabled: AllowedFilter[] = Array.isArray(value) ? value : [];

	const isEnabled = (categoryId: number, key: string) =>
		enabled.some((e) => e.categoryId === categoryId && e.key === key);

	const toggle = (categoryId: number, key: string, checked: boolean) => {
		if (checked) {
			setValue([...enabled, { categoryId, key }]);
		} else {
			setValue(
				enabled.filter((e) => !(e.categoryId === categoryId && e.key === key)),
			);
		}
	};

	if (available.length === 0) return null;

	return (
		<div className="field-type json">
			<FieldLabel as="label" label={field.label as string} />
			{field.admin?.description && (
				<FieldDescription description={field.admin.description} path={path} />
			)}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "0.5rem",
					marginTop: "0.5rem",
				}}
			>
				{available.map((f) => {
					const id = `custom-filter-${f.categoryId}-${f.key}`;
					return (
						<div
							key={id}
							style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
						>
							<input
								type="checkbox"
								id={id}
								checked={isEnabled(f.categoryId, f.key)}
								onChange={(e) => toggle(f.categoryId, f.key, e.target.checked)}
								style={{
									width: "1rem",
									height: "1rem",
									cursor: "pointer",
									flexShrink: 0,
									accentColor: "var(--theme-success-500)",
								}}
							/>
							<label
								htmlFor={id}
								style={{
									fontSize: "0.875rem",
									color: "var(--theme-text)",
									cursor: "pointer",
								}}
							>
								<span style={{ fontWeight: 500 }}>{f.label}</span>
								<span
									style={{
										color: "var(--theme-elevation-500)",
										marginLeft: "0.375rem",
									}}
								>
									({f.categoryName} —{" "}
									{f.fieldType === "checkbox" ? "Oui/Non" : "Liste"})
								</span>
							</label>
						</div>
					);
				})}
			</div>
		</div>
	);
}
