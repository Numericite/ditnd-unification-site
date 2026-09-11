"use client";

import { TextInput, useField, useFormFields } from "@payloadcms/ui";
import { type ChangeEvent, useEffect } from "react";

export default function ImageAltField({
	path,
	field,
}: {
	path: string;
	field: {
		label?: unknown;
		required?: boolean;
	};
}) {
	const { value, setValue } = useField<string>({ path });
	const rawImage = useFormFields(([fields]) => fields.image?.value);
	const altType = useFormFields(([fields]) => fields.altType?.value);

	const imageId =
		rawImage == null
			? null
			: typeof rawImage === "object"
				? (rawImage as { id: number }).id
				: (rawImage as number);

	useEffect(() => {
		if (altType !== "nonDecorative") return;
		if (!imageId) return;
		if (value) return;

		let cancelled = false;

		fetch(`/api/medias/${imageId}?depth=0`)
			.then((r) => (r.ok ? r.json() : null))
			.then((media) => {
				if (!cancelled && media?.alt) setValue(media.alt);
			})
			.catch(() => {});

		return () => {
			cancelled = true;
		};
	}, [altType, imageId, value, setValue]);

	return (
		<TextInput
			path={path}
			value={value ?? ""}
			onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
			label={field.label as string}
			required={field.required}
		/>
	);
}
