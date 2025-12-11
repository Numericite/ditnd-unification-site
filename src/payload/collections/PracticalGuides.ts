import type { CollectionConfig } from "payload";
import {
  lexicalEditor,
  FixedToolbarFeature,
  OrderedListFeature,
} from "@payloadcms/richtext-lexical";
import { convertLexicalToHTML } from "@payloadcms/richtext-lexical/html";

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
      name: "description",
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
