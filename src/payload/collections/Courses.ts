import type { CollectionConfig } from "payload";

export const Courses: CollectionConfig = {
  slug: "courses",
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "link",
      type: "text",
      required: true,
    },
    {
      name: "theme",
      type: "relationship",
      required: true,
      relationTo: "theme",
    },
    {
      name: "persona",
      type: "relationship",
      required: true,
      relationTo: "theme",
    },
    {
      name: "condition",
      type: "relationship",
      required: true,
      relationTo: "condition",
    },
  ],
};
