import type { CollectionConfig } from "payload";

export const Conditions: CollectionConfig = {
  slug: "conditions",
  admin: {
    useAsTitle: "acronym",
  },
  labels: {
    singular: "Trouble du neurodéveloppement",
    plural: "Troubles du neurodéveloppement",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "text",
      required: true,
    },
    {
      name: "acronym",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
  ],
};
