import { type Payload } from "payload";
import { TRPCError } from "@trpc/server";

const conditions = [
  {
    name: "Trouble du langage",
    description: "Difficultés à comprendre ou produire le langage oral.",
    acronym: "TL",
    slug: "tl",
  },
  {
    name: "Trouble du développement de la coordination",
    description: "Difficultés motrices impactant la coordination des gestes.",
    acronym: "TDC",
    slug: "tdc",
  },
  {
    name: "Troubles spécifiques des apprentissages",
    description: "Difficultés ciblées de lecture, écriture ou mathématiques.",
    acronym: "TSAp",
    slug: "tsap",
  },
  {
    name: "Trouble du déficit de l’attention avec ou sans hyperactivité",
    description: "Difficultés d’attention, impulsivité et agitation.",
    acronym: "TDAH",
    slug: "tdah",
  },
  {
    name: "Trouble du développement intellectuel",
    description:
      "Limitations des capacités intellectuelles et du fonctionnement adaptatif.",
    acronym: "TDI",
    slug: "tdi",
  },
  {
    name: "Autisme",
    description:
      "Trouble du neurodéveloppement affectant la communication et les interactions sociales.",
    acronym: "TSA",
    slug: "tsa",
  },
];

async function createConditions(
  payload: Payload,
  data: { name: string; description: string; acronym: string; slug: string }
): Promise<void> {
  try {
    await payload.create({
      collection: "conditions",
      data,
    });
  } catch (error) {
    throw new TRPCError({
      message: `Error creating organization ${data.acronym}`,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}

export async function seedConditions(payload: Payload) {
  for (const condition of conditions) {
    await createConditions(payload, condition);
  }
}
