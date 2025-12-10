import type { CollectionConfig } from "payload";

export const PracticalGuide: CollectionConfig = {
  slug: "practical-guide",
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
      name: "condition",
      type: "relationship",
      required: false,
      relationTo: "condition",
    },
    {
      name: "content",
      type: "text",
      required: true,
    },
    {
      name: "persona",
      type: "relationship",
      required: true,
      relationTo: "persona",
    },
    {
      name: "theme",
      type: "relationship",
      required: true,
      relationTo: "theme",
    },
    {
      name: "practical-guide",
      type: "relationship",
      required: false,
      relationTo: "practical-guide",
    },
    {
      name: "courses",
      type: "relationship",
      required: false,
      relationTo: "courses",
    },
  ],
};
