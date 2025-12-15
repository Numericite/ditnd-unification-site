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
      name: "description",
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
      relationTo: "themes",
    },
    {
      name: "persona",
      type: "relationship",
      required: true,
      relationTo: "personas",
    },
    {
      name: "conditions",
      type: "relationship",
      required: true,
      relationTo: "conditions",
    },
  ],
};
