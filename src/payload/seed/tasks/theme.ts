import { type Payload } from "payload";
import { TRPCError } from "@trpc/server";

const theme = [
  {
    name: "Sensibilisation",
    description: "Sensibilisation",
    slug: "sb",
  },
  {
    name: "Communication",
    description: "Communication",
    slug: "cm",
  },
  {
    name: "Sensorialité",
    description: "Sensibilisation",
    slug: "sr",
  },
  {
    name: "Pédagogie",
    description: "Pédagogie",
    slug: "pg",
  },
];

async function createTheme(
  payload: Payload,
  data: { name: string; description: string; slug: string }
): Promise<void> {
  try {
    await payload.create({
      collection: "themes",
      data,
    });
  } catch (error) {
    throw new TRPCError({
      message: `Error creating organization ${data.name}`,
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}

export async function seedTheme(payload: Payload) {
  for (const condition of theme) {
    await createTheme(payload, condition);
  }
}
