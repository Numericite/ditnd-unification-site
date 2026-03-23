import { BlocksFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { Field } from "payload";
import { AccordionBlock } from "../plugins/blocks/AccordionBlock";
import { CalloutBlock } from "../plugins/blocks/CalloutBlock";
import { CitationBlock } from "../plugins/blocks/CitationBlock";
import { CustomImageBlock } from "../plugins/blocks/CustomImageBlock";
import { YouTubeBlock } from "../plugins/blocks/YouTubeBlock";
import { HighlightBlock } from "../plugins/blocks/HighlightBlock";
import { defaultWysiwygFeatures } from "./defaultWysiwygFeatures";

export const standardFields = {
  title: {
    name: "title",
    label: "Titre",
    type: "text",
    required: true,
  },
  description: {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    maxLength: 120,
    admin: {
      description:
        "Description courte affichée sur les cartes (120 caractères max)",
      components: {
        Field: "../payload/components/DescriptionTextarea",
      },
    },
    validate: (val: string | undefined | null) => {
      if (val && val.length > 120) {
        return `La description ne doit pas dépasser 120 caractères (actuellement ${val.length})`;
      }
      return true;
    },
  },
  button: {
    label: "Lien associé",
    type: "collapsible",
    admin: {
      initCollapsed: true,
    },
    required: true,
    fields: [
      {
        name: "buttonText",
        label: "Texte du bouton",
        type: "text",
        required: true,
      },
      {
        name: "buttonLink",
        label: "Lien du bouton",
        type: "text",
        required: true,
      },
    ],
  },
  wysiwyg: {
    name: "content",
    type: "richText",
    required: true,
    label: { fr: "Contenu" },
    editor: lexicalEditor({
      admin: {
        placeholder: "Commencez à écrire...",
        hideGutter: false,
      },

      features: ({ defaultFeatures }) => [
        ...defaultWysiwygFeatures({ defaultFeatures }),
        BlocksFeature({
          blocks: [
            AccordionBlock,
            CustomImageBlock,
            YouTubeBlock,
            CitationBlock,
            HighlightBlock,
            CalloutBlock,
          ],
        }),
      ],
    }),
  },
  image: {
    name: "image",
    label: "Image",
    type: "upload",
    relationTo: "medias",
    required: true,
  },
} satisfies Record<string, Field>;
