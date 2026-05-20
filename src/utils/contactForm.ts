import type { z } from "zod";

export const INVALID_MESSAGE_REGEX = /[<>{}[\]\\]/;

export function zodValidator<Schema extends z.ZodTypeAny>(schema: Schema) {
	return ({ value }: { value: unknown }) => {
		const result = schema.safeParse(value);
		if (result.success) return undefined;
		const fields: Record<string, string> = {};
		for (const issue of result.error.issues) {
			const key = issue.path.join(".");
			if (!fields[key]) fields[key] = issue.message;
		}
		return { fields };
	};
}
