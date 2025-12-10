import type { CollectionConfig } from "payload";
import { isAdmin } from "../hooks";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  auth: true,
  fields: [
    { type: "text", name: "firstName" },
    { type: "text", name: "lastName" },
    {
      name: "role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      required: true,
      defaultValue: "editor",
    },
  ],
};
