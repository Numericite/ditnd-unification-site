import type { SanitizedDocumentPermissions } from "payload";

export const GENERATOR_GLOBAL_SLUG = "simplified-content-generator";

export const generatorDocPermissions: SanitizedDocumentPermissions = {
	fields: true,
	read: true,
	update: true,
};
