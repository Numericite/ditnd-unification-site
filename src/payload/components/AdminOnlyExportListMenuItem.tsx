import { ExportListMenuItem } from "@payloadcms/plugin-import-export/rsc";
import type { ComponentProps } from "react";
import type { User } from "~/payload/payload-types";

type Props = ComponentProps<typeof ExportListMenuItem> & {
	user?: User | null;
};

/**
 * Bouton « Exporter » du plugin import-export, réservé aux admins.
 * Composant serveur : Payload lui passe `user` en plus des clientProps.
 */
export function AdminOnlyExportListMenuItem({
	user,
	collectionSlug,
	exportCollectionSlug,
}: Props) {
	if (user?.role !== "admin") return null;

	return (
		<ExportListMenuItem
			collectionSlug={collectionSlug}
			exportCollectionSlug={exportCollectionSlug}
		/>
	);
}
