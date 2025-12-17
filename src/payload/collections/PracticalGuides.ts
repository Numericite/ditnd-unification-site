import type { CollectionConfig } from "payload";
import {
  lexicalEditor,
  FixedToolbarFeature,
} from "@payloadcms/richtext-lexical";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

export const PracticalGuides: CollectionConfig = {
  slug: "practical-guides",
  admin: {
    useAsTitle: "title",
  },
  labels: {
    singular: "Fiche pratique",
    plural: "Fiches pratiques",
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
      name: "conditions",
      type: "relationship",
      required: false,
      relationTo: "conditions",
    },
    {
      name: "content",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        admin: {
          placeholder: "Content of the practical guide",
          hideGutter: false,
        },

        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
        ],
      }),
    },
    {
      name: "html",
      type: "text",
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          async ({ siblingData }) => {
            if (!siblingData?.content) return "";
            return convertLexicalToHTML({ data: siblingData.content });
          },
        ],
      },
    },
    {
      name: "persona",
      type: "relationship",
      required: true,
      relationTo: "personas",
    },
    {
      name: "theme",
      type: "relationship",
      required: true,
      relationTo: "themes",
    },
    {
      name: "practical-guides",
      type: "relationship",
      required: false,
      relationTo: "practical-guides",
    },
    {
      name: "courses",
      type: "relationship",
      required: false,
      relationTo: "courses",
    },
  ],
};
