import type { CollectionSlug, Field } from "payload";
import { slugify } from "~/utils/tools";

/**
 * Hidden, auto-generated slug derived from `title`.
 * Untitled documents (e.g. the empty draft created by autosave) fall back to
 * `${collection}-${id}` so the unique constraint is never hit by two empty
 * drafts. On the very first insert there is no id yet, so the slug is `null`.
 */
export const slugField = (collection: CollectionSlug): Field => ({
	name: "slug",
	type: "text",
	required: true,
	unique: true,
	label: { fr: "Identifiant texte" },
	admin: {
		position: "sidebar",
		readOnly: true,
		hidden: true,
	},
	hooks: {
		beforeChange: [
			({ siblingData, originalDoc }) => {
				if (siblingData?.title) return slugify(siblingData.title);
				const id = originalDoc?.id;
				return id ? `${collection}-${id}` : null;
			},
		],
	},
});
