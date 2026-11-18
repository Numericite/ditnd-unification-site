import type { CollectionBeforeDeleteHook, CollectionConfig } from "payload";
import type { Journey } from "../payload-types";
import { standardFields } from "../fields/standards";
import { hideForNonAdmin, isAdmin } from "../hooks";
import { validateHexColor } from "~/utils/tools";

// FK is ON DELETE SET NULL on a NOT NULL column, so rows must go first. db.updateOne rather
// than payload.update, which would revalidate the whole journey and could block on an unrelated field.
const beforeDeleteCondition: CollectionBeforeDeleteHook = async ({
	id,
	req,
}) => {
	const conditionId = Number(id);

	const { docs: journeys } = await req.payload.find({
		collection: "journeys",
		where: { "conditionTexts.condition": { equals: conditionId } },
		depth: 0,
		limit: 0,
		pagination: false,
		select: { conditionTexts: true },
		req,
	});

	for (const journey of journeys) {
		const data: Pick<Journey, "conditionTexts"> = {
			conditionTexts: (journey.conditionTexts ?? []).filter(
				(row) => row.condition !== conditionId,
			),
		};

		await req.payload.db.updateOne({
			collection: "journeys",
			id: journey.id,
			data,
			returning: false,
			req,
		});
	}
};

export const Conditions: CollectionConfig = {
	slug: "conditions",
	admin: {
		useAsTitle: "name",
		group: { fr: "Taxonomies" },
		hidden: hideForNonAdmin,
	},
	access: {
		create: isAdmin,
		update: isAdmin,
		delete: isAdmin,
	},
	labels: {
		singular: "Trouble du neurodéveloppement",
		plural: "Troubles du neurodéveloppement",
	},
	orderable: true,
	hooks: {
		beforeDelete: [beforeDeleteCondition],
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: { fr: "Nom" },
		},
		standardFields.description,
		{
			name: "fullDescription",
			type: "textarea",
			required: true,
			label: { fr: "Description complète" },
		},
		{
			name: "acronym",
			type: "text",
			required: true,
			label: { fr: "Acronyme" },
		},
		{
			name: "slug",
			type: "text",
			required: true,
			unique: true,
			label: { fr: "Identifiant texte" },
		},
		{
			name: "textColor",
			type: "text",
			label: "Couleur du texte",
			defaultValue: "#162316",
			required: true,
			admin: {
				components: {
					Field: { path: "../payload/components/ColorPicker" },
				},
			},
			validate: (value: unknown) => validateHexColor(value),
		},
		{
			name: "backgroundColor",
			type: "text",
			label: "Couleur de fond",
			defaultValue: "#F4F5F0",
			required: true,
			admin: {
				components: {
					Field: { path: "../payload/components/ColorPicker" },
				},
			},
			validate: (value: unknown) => validateHexColor(value),
		},
		{
			name: "relatedPracticalGuides",
			type: "join",
			collection: "practical-guides",
			on: "conditions",
			label: "Fiches pratiques associées",
			admin: {
				position: "sidebar",
				allowCreate: false,
				defaultColumns: ["title", "_status"],
			},
		},
		{
			name: "relatedCourses",
			type: "join",
			collection: "courses",
			on: "conditions",
			label: "Formations associées",
			admin: {
				position: "sidebar",
				allowCreate: false,
				defaultColumns: ["title", "_status"],
			},
		},
	],
};
