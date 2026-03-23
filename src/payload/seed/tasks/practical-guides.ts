import type { Payload } from "payload";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { PracticalGuidesContent } from "~/utils/wysiwyg-content";

const content = PracticalGuidesContent;

const guides = [
  {
    title: "Le TSA expliqué aux familles",
    slug: "le_tsa_explique_aux_familles",
    description:
      "Un éclairage sur ce qu'est l'autisme, adapté aux parents et proches, pour mieux comprendre les besoins de leur enfant.",
    conditions: [4],
    persona: [1],
    themes: [1, 4],
    practicalGuides: [],
    courses: [2, 3],
    viewCount: 50,
    image: 7,
    imageBanner: 7,
  },
  {
    title: "Où trouver du soutien et du répit en tant que proche aidant ?",
    slug: "ou-trouver-du-soutien-et-du-repit-en-tant-que-proche-aidant",
    description:
      "Vous aidez un proche en situation de handicap ? Découvrez les solutions de soutien et de répit disponibles.",
    conditions: [4],
    persona: [1],
    practicalGuides: [],
    themes: [1],
    viewCount: 39,
    image: 6,
    imageBanner: 6,
  },
  {
    title: "Se former quand on est proche aidant d’une personne autiste",
    slug: "se-former-quand-on-est-proche-aidant-d-une-personne-autiste",
    description:
      "Vous êtes proche aidant d'une personne autiste ? Découvrez les formations disponibles pour mieux comprendre l'autisme.",
    conditions: [4],
    practicalGuides: [],
    persona: [2],
    themes: [4],
    viewCount: 56,
    image: 2,
    imageBanner: 2,
  },
  {
    title: "Proche aidant d’une personne autiste : guide pratique",
    slug: "proche-aidant-d-une-personne-autiste-guide-pratique",
    description:
      "Être proche aidant d'une personne autiste peut être exigeant. Découvrez votre rôle et les ressources disponibles.",
    conditions: [4],
    practicalGuides: [],

    persona: [1],
    themes: [4],
    viewCount: 43,
    image: 4,
    imageBanner: 4,
  },
  {
    title: "Plateforme de coordination et d’orientation et TND",
    slug: "plateforme-de-coordination-et-d-orientation-et-tnd",
    description:
      "Votre enfant présente un écart de développement ? Découvrez le rôle des plateformes de coordination et d'orientation.",
    conditions: [],
    practicalGuides: [],
    persona: [1],
    themes: [8],
    viewCount: 55,
    image: 1,
    imageBanner: 1,
  },
  {
    title: "Droit du proche aidant d’une personne autiste",
    slug: "droit-du-proche-aidant-d-une-personne-autiste",
    description:
      "Les droits du proche aidant sont reconnus par la loi. Découvrez vos droits professionnels, sociaux et financiers.",
    conditions: [4],
    practicalGuides: [],
    persona: [1],
    themes: [1],
    viewCount: 67,
    image: 3,
    imageBanner: 3,
  },
];

async function createPracticalGuide(
  payload: Payload,
  data: {
    title: string;
    slug: string;
    description: string;
    conditions?: number[];
    content: DefaultTypedEditorState;
    persona: number[];
    themes: number[];
    practicalGuides?: number[];
    courses?: number[];
    viewCount: number;
    image: number;
    imageBanner: number;
  },
): Promise<void> {
  try {
    await payload.create({
      collection: "practical-guides",
      data,
    });
  } catch (error) {
    throw new Error(
      `Error creating practical guides ${data.title} with error ${error}`,
    );
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
