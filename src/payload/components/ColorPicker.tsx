"use client";
import { FieldLabel, TextInput, useField } from "@payloadcms/ui";
import type { TextFieldClientComponent } from "payload";

const ColorPicker: TextFieldClientComponent = ({ field, path }) => {
	const { value, setValue } = useField<string>({ path });

	const { label, required } = field;

	return (
		<div>
			<FieldLabel label={label} required={required} />
			<div
				style={{
					marginTop: "8px",
					marginBottom: "8px",
					display: "flex",
					gap: "16px",
				}}
			>
				<input
					type="color"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<TextInput
					label=""
					path={path}
					onChange={(e: { target: { value: string } }) =>
						setValue(e.target.value)
					}
					value={value}
				/>
			</div>
		</div>
	);
};

export default ColorPicker;
