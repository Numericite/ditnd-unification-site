import { fr } from "@codegouvfr/react-dsfr";
import type { ComponentType } from "react";
import ContactParticuliersForm from "~/components/ui/ContactParticuliersForm/ContactParticuliersForm";
import ContactProsCraForm from "~/components/ui/ContactProsCraForm/ContactProsCraForm";
import type { Page } from "~/payload/payload-types";

const MODULES: Record<NonNullable<Page["module"]>, ComponentType> = {
	"contact-particuliers": ContactParticuliersForm,
	"contact-pros-cra": ContactProsCraForm,
};

export default function PageModule({ name }: { name: Page["module"] }) {
	const Module = name ? MODULES[name] : null;
	if (!Module) return null;

	return (
		<div className={fr.cx("fr-mt-6w")}>
			<Module />
		</div>
	);
}
