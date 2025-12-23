import { type Payload } from "payload";
import { TRPCError } from "@trpc/server";
import type { Course } from "../../payload-types";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

const content: DefaultTypedEditorState[] = [
  {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "heading",
          tag: "h1",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "text",
              text: "L'autisme expliqué aux familles",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              version: 1,
            },
          ],
          direction: null,
        },
      ],
      direction: null,
    },
  },
  {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children: [
        {
          type: "heading",
          tag: "h1",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              type: "text",
              text: "Manifestations possibles selon l'âge",
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              version: 1,
            },
          ],
          direction: null,
        },
      ],
      direction: null,
    },
  },
];

const guides = [
  {
    title: "L'autisme expliqué aux familles",
    description:
      "Un éclairage sur ce qu'est l'autisme, adapté aux parents et proches, pour mieux comprendre les besoins de leur enfant.",
    condition: [1],
    persona: [1],
    theme: [1],
  },
  {
    title: "Manifestations possibles selon l'âge",
    description:
      "Comment l'autisme peut apparaître différemment chez un jeune enfant, un adolescnent ou un adulte.",
    condition: [1],
    persona: [1],
    theme: [2],
  },
];

async function createPracticalGuide(
  payload: Payload,
  data: {
    title: string;
    description: string;
    conditions?: number[];
    content: DefaultTypedEditorState;
    html?: string;
    persona: number[];
    theme: number[];
    practicalGuide?: number;
    courses?: Course[];
  }
): Promise<void> {
  try {
    await payload.create({
      collection: "practical-guides",
      data,
    });
  } catch (error) {
    throw new TRPCError({
      message: `Error creating organization ${data.title}`,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}

export async function seedPracticalGuides(payload: Payload) {
  for (let i = 0; i < guides.length; i++) {
    const guide = guides[i];
    const textContent = content[i];

    if (!guide) {
      throw new Error(`Missing guide at index ${i}`);
    }

    if (!textContent) {
      throw new Error(`Missing content at index ${i}`);
    }

    await createPracticalGuide(payload, {
      ...guide,
      content: textContent,
    });
  }
}
