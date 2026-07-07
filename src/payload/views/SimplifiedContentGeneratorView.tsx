import { DefaultTemplate } from "@payloadcms/next/templates";
import { HydrateAuthProvider, SetStepNav } from "@payloadcms/ui";
import { buildFormState } from "@payloadcms/ui/utilities/buildFormState";
import type { AdminViewServerProps } from "payload";
import SimplifiedContentGeneratorClient from "./SimplifiedContentGeneratorClient";
import {
	GENERATOR_GLOBAL_SLUG,
	generatorDocPermissions,
} from "./simplifiedContentGeneratorShared";

export default async function SimplifiedContentGeneratorView({
	initPageResult,
	params,
	searchParams,
}: AdminViewServerProps) {
	const { req, permissions, visibleEntities, locale } = initPageResult;

	const { state: initialState } = await buildFormState({
		globalSlug: GENERATOR_GLOBAL_SLUG,
		data: {},
		docPermissions: generatorDocPermissions,
		docPreferences: { fields: {} },
		operation: "update",
		renderAllFields: true,
		req,
		schemaPath: GENERATOR_GLOBAL_SLUG,
		skipValidation: true,
	});

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
					{
						label: "Générateur de contenu simplifié",
						url: "/admin/simplified-content-generator",
					},
				]}
			/>
			<SimplifiedContentGeneratorClient initialState={initialState} />
		</DefaultTemplate>
	);
}
