"use client";

import {
	FieldDescription,
	FieldLabel,
	useField,
	useFormFields,
} from "@payloadcms/ui";
import { useEffect, useState } from "react";

type FieldOption = {
	id?: string | null;
	label: string;
	value: string;
};

type CustomFieldDef = {
	id?: string | null;
	label: string;
	key: string;
	type: "checkbox" | "text" | "select";
	options?: FieldOption[] | null;
};

const inputStyle: React.CSSProperties = {
	width: "100%",
	padding: "10px",
	fontFamily: "inherit",
	fontSize: "inherit",
	border: "1px solid var(--theme-elevation-150)",
	borderRadius: "4px",
	background: "var(--theme-input-bg)",
	color: "var(--theme-text)",
};

const labelStyle: React.CSSProperties = {
	fontSize: "0.8125rem",
	fontWeight: 600,
	color: "var(--theme-elevation-800)",
	marginBottom: "0.25rem",
};

export default function MetadataField({
	path,
	field,
}: {
	path: string;
	field: {
		label?: unknown;
		required?: boolean;
		admin?: { description?: string };
	};
}) {
	const { value, setValue } = useField<Record<string, unknown>>({ path });
	const rawCategoryValue = useFormFields(([fields]) => fields.category?.value);
	const [customFields, setCustomFields] = useState<CustomFieldDef[]>([]);

	const categoryId =
		rawCategoryValue == null
			? null
			: typeof rawCategoryValue === "object"
				? (rawCategoryValue as { id: number }).id
				: (rawCategoryValue as number);

	const metadata = value ?? {};

	useEffect(() => {
		if (!categoryId) {
			setCustomFields([]);
			return;
		}
		fetch(`/api/map-categories/${categoryId}?depth=0`)
			.then((r) => (r.ok ? r.json() : null))
			.then((data) =>
				setCustomFields(
					Array.isArray(data?.customFields) ? data.customFields : [],
				),
			)
			.catch(() => setCustomFields([]));
	}, [categoryId]);

	if (customFields.length === 0) return null;

	const handleChange = (key: string, newValue: unknown) => {
		setValue({ ...metadata, [key]: newValue });
	};

	return (
		<div className="field-type json">
			<FieldLabel
				as="label"
				label={field.label as string}
				required={field.required}
			/>
			{field.admin?.description && (
				<FieldDescription description={field.admin.description} path={path} />
			)}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "0.875rem",
					marginTop: "0.5rem",
				}}
			>
				{customFields.map((f) => {
					const val = metadata[f.key];
					const id = `meta-${f.key}`;

					if (f.type === "checkbox") {
						return (
							<div
								key={f.id ?? f.key}
								style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
							>
								<input
									type="checkbox"
									id={id}
									checked={Boolean(val)}
									onChange={(e) => handleChange(f.key, e.target.checked)}
									style={{
										width: "1rem",
										height: "1rem",
										cursor: "pointer",
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
									{f.label}
								</label>
							</div>
						);
					}

					if (f.type === "text") {
						return (
							<div
								key={f.id ?? f.key}
								style={{ display: "flex", flexDirection: "column" }}
							>
								<label htmlFor={id} style={labelStyle}>
									{f.label}
								</label>
								<input
									type="text"
									id={id}
									value={String(val ?? "")}
									onChange={(e) => handleChange(f.key, e.target.value || null)}
									style={inputStyle}
								/>
							</div>
						);
					}

					if (f.type === "select") {
						return (
							<div
								key={f.id ?? f.key}
								style={{ display: "flex", flexDirection: "column" }}
							>
								<label htmlFor={id} style={labelStyle}>
									{f.label}
								</label>
								<select
									id={id}
									value={String(val ?? "")}
									onChange={(e) => handleChange(f.key, e.target.value || null)}
									style={{ ...inputStyle, cursor: "pointer" }}
								>
									<option value="">— Choisir —</option>
									{f.options?.map((opt) => (
										<option key={opt.value} value={opt.value}>
											{opt.label}
										</option>
									))}
								</select>
							</div>
						);
					}

					return null;
				})}
			</div>
		</div>
	);
}
