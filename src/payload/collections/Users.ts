import type { CollectionConfig } from "payload";
import { hideForNonAdmin, isAdmin } from "../hooks";

export const Users: CollectionConfig = {
	slug: "users",
	admin: {
		useAsTitle: "email",
		group: { fr: "Autre" },
		hidden: hideForNonAdmin,
	},
	labels: {
		singular: "Utilisateur",
		plural: "Utilisateurs",
	},
	access: {
		read: isAdmin,
		create: isAdmin,
		update: isAdmin,
		delete: isAdmin,
	},
	auth: true,
	fields: [
		{ type: "text", name: "firstName", label: { fr: "Prénom" } },
		{ type: "text", name: "lastName", label: { fr: "Nom" } },
		{
			name: "role",
			type: "select",
			options: [
				{ label: "Admin", value: "admin" },
				{ label: "Editor", value: "editor" },
			],
			required: true,
			defaultValue: "editor",
			label: { fr: "Rôle" },
		},
	],
};
