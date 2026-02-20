"use client";
import { TextInput, useField } from "@payloadcms/ui";

const ColorPicker = ({
	field: { label, required = false },
	path,
}: {
	field: { label: string; required?: boolean };
	path: string;
}) => {
	const { value, setValue } = useField<string>({ path });

	return (
		<div>
			<div>
				{label} {required && <span className="required">*</span>}
			</div>
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
