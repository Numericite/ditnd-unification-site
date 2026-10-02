import type { CollectionSlug, Field } from "payload";
import { slugify } from "~/utils/tools";

type SlugFieldOptions = {
	/** Shows the field in the admin sidebar so editors can override it. */
	editable?: boolean;
};

/**
 * Auto-generated slug derived from `title`.
 * Untitled documents (e.g. the empty draft created by autosave) fall back to
 * `${collection}-${id}` so the unique constraint is never hit by two empty
 * drafts. On the very first insert there is no id yet, so the slug is `null`.
 *
 * When `editable`, a slug typed by the editor is kept (slugified) and no
 * longer follows the title. A slug the editor never touched — i.e. still
 * equal to what the title would have produced — keeps following the title,
 * and clearing the field reverts to the automatic slug.
 */
export const slugField = (
	collection: CollectionSlug,
	{ editable = false }: SlugFieldOptions = {},
): Field => {
	const autoSlug = (title: unknown, id: unknown): string | null => {
		if (typeof title === "string" && title) return slugify(title);
		return id ? `${collection}-${id}` : null;
	};

	return {
		name: "slug",
		type: "text",
		required: true,
		unique: true,
		label: { fr: "Identifiant texte" },
		admin: editable
			? {
					position: "sidebar",
					description:
						"Utilisé dans l'URL de la page. Laissez vide pour le générer à partir du titre. Le modifier change l'URL publique : pensez à ajouter une redirection.",
				}
			: {
					position: "sidebar",
					readOnly: true,
					hidden: true,
				},
		// The value is filled server-side by the hook below when left empty.
		...(editable && { validate: () => true as const }),
		hooks: {
			beforeChange: [
				({ value, siblingData, originalDoc }) => {
					const generated = autoSlug(siblingData?.title, originalDoc?.id);
					if (!editable) return generated;

					const input = typeof value === "string" ? slugify(value) : "";
					if (!input) return generated;

					const previousSlug = originalDoc?.slug;
					const wasAuto =
						previousSlug &&
						previousSlug === autoSlug(originalDoc?.title, originalDoc?.id);
					if (wasAuto && input === previousSlug) return generated;

					return input;
				},
			],
		},
	};
};
