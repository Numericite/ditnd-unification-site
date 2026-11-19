"use client";

import {
	CheckboxInput,
	Collapsible,
	FieldError,
	TextInput,
	useField,
} from "@payloadcms/ui";
import { LockIcon } from "@payloadcms/ui/icons/Lock";
import { LOCKED_MENU_ITEMS, type LockedMenuItem } from "~/utils/menu";

// Édite le groupe « lockedItems » (masqué dans l'admin) sous forme de lignes
// verrouillées en tête de la liste du menu : renommables et masquables, mais
// ni déplaçables ni supprimables.
function LockedRow({ item }: { item: LockedMenuItem }) {
	const title = useField<string>({ path: `lockedItems.${item.key}.title` });
	const visible = useField<boolean>({
		path: `lockedItems.${item.key}.visible`,
	});
	const hidden = visible.value === false;

	return (
		<Collapsible
			className="array-field__row"
			collapsibleStyle={title.showError ? "error" : "default"}
			initCollapsed
			header={
				<div
					className="array-field__row-header"
					style={{
						display: "flex",
						alignItems: "center",
						gap: "0.5rem",
						width: "100%",
					}}
				>
					<LockIcon />
					<span style={{ opacity: hidden ? 0.55 : 1 }}>
						{title.value || item.title}
					</span>
					{hidden && <span style={{ opacity: 0.6 }}>— masqué</span>}
					<span
						style={{
							marginLeft: "auto",
							fontSize: "0.8125rem",
							whiteSpace: "nowrap",
						}}
					>
						Élément fixe
					</span>
				</div>
			}
		>
			<TextInput
				path={title.path}
				label="Libellé"
				required
				value={title.value ?? ""}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					title.setValue(e.target.value)
				}
				showError={title.showError}
				Error={
					<FieldError
						path={title.path}
						message={title.errorMessage}
						showError={title.showError}
					/>
				}
			/>
			<div style={{ marginTop: "1rem" }}>
				<CheckboxInput
					id={`field-${visible.path.replace(/\./g, "__")}`}
					label="Afficher l'élément"
					checked={visible.value !== false}
					onToggle={(e) => visible.setValue(e.target.checked)}
				/>
			</div>
		</Collapsible>
	);
}

export default function MenuLockedItems() {
	return (
		<div className="array-field__draggable-rows">
			{LOCKED_MENU_ITEMS.map((item) => (
				<LockedRow key={item.key} item={item} />
			))}
		</div>
	);
}
