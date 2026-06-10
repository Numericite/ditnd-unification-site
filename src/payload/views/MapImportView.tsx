import { DefaultTemplate } from "@payloadcms/next/templates";
import { HydrateAuthProvider, SetStepNav } from "@payloadcms/ui";
import type { AdminViewServerProps } from "payload";
import MapImportClient from "./MapImportClient";

export default function MapImportView({
	initPageResult,
	params,
	searchParams,
}: AdminViewServerProps) {
	const { req, permissions, visibleEntities, locale } = initPageResult;

	return (
		<DefaultTemplate
			i18n={req.i18n}
			locale={locale}
			params={params}
			payload={req.payload}
			permissions={permissions}
			req={req}
			searchParams={searchParams as Record<string, string | string[]>}
			user={req.user ?? undefined}
			visibleEntities={{
				collections: visibleEntities?.collections,
				globals: visibleEntities?.globals,
			}}
		>
			<HydrateAuthProvider permissions={permissions} />
			<SetStepNav
				nav={[
					{ label: "Cartographie" },
					{ label: "Importer des points", url: "/admin/map-import" },
				]}
			/>
			<MapImportClient />
		</DefaultTemplate>
	);
}
