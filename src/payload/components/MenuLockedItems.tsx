"use client";

import { LockIcon } from "@payloadcms/ui/icons/Lock";
import { LOCKED_MENU_ITEMS } from "~/utils/menu";

// Lignes affichées en tête de la liste « Éléments du menu » (beforeInput du
// champ array), avec le même rendu qu'un élément replié, mais grisées et sans
// action : ces éléments sont générés par le code de la navbar.
export default function MenuLockedItems() {
	return (
		<div className="array-field__draggable-rows">
			{LOCKED_MENU_ITEMS.map((item) => (
				<div
					key={item}
					className="collapsible array-field__row collapsible--collapsed collapsible--style-default collapsible--has-drag-handle"
					title="Élément fixe : non modifiable"
					style={{ opacity: 0.55, cursor: "not-allowed" }}
				>
					<div className="collapsible__toggle-wrap">
						<div className="collapsible__drag" aria-hidden="true">
							<LockIcon />
						</div>
						<div className="collapsible__header-wrap collapsible__header-wrap--has-drag-handle">
							<div className="array-field__row-header">
								<span>{item}</span>
							</div>
						</div>
						<span
							style={{
								alignSelf: "center",
								paddingRight: "1rem",
								fontSize: "0.8125rem",
								whiteSpace: "nowrap",
							}}
						>
							Élément fixe
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
