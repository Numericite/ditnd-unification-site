import type { CollectionConfig } from "payload";
import { relationship } from "payload/shared";

export const Journeys: CollectionConfig = {
  slug: "journey",
  admin: {
    useAsTitle: "journey_name",
  },
  fields: [
    {
      name: "journey_name",
      label: "Name of your journey",
      type: "text",
      required: true,
    },
    {
      type: "tabs",
      tabs: [
        {
          name: "persona",
          fields: [
            {
              name: "persona",
              type: "relationship",
              relationTo: "persona",
            },
            {
              name: "chapter",
              type: "array",
              fields: [
                {
                  name: "chapter-name",
                  type: "text",
                  required: true,
                },
                {
                  name: "practical-guide-list",
                  type: "array",
                  required: true,
                  fields: [
                    {
                      name: "practical-guide",
                      type: "relationship",
                      relationTo: "practical-guide",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
