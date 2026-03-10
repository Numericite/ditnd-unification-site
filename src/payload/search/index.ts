import type { BeforeSync } from "@payloadcms/plugin-search/types";

/**
 * Recursively extracts plain text from a Lexical editor JSON tree.
 */
function extractTextFromLexical(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  const n = node as Record<string, unknown>;

  if (n.type === "text" && typeof n.text === "string") {
    return n.text;
  }

  if (Array.isArray(n.children)) {
    return n.children.map(extractTextFromLexical).join(" ");
  }

  if (n.root && typeof n.root === "object") {
    return extractTextFromLexical(n.root);
  }

  return "";
}

/**
 * Resolves relation names from a hasMany relationship field.
 * Handles both populated objects and raw IDs.
 */
async function resolveRelationNames(
  payload: Parameters<BeforeSync>[0]["payload"],
  items: unknown[] | null | undefined,
  collection: string,
  nameField: string,
): Promise<string> {
  if (!items?.length) return "";

  const names = await Promise.all(
    items.map(async (item) => {
      if (typeof item === "object" && item !== null && nameField in item) {
        return (item as Record<string, string>)[nameField];
      }
      if (typeof item === "number" || typeof item === "string") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doc = await payload.findByID({
          collection: collection as any,
          id: item as number,
        });
        return (doc as Record<string, string>)[nameField];
      }
      return "";
    }),
  );

  return names.filter(Boolean).join(" ");
}

export const beforeSyncPracticalGuide: BeforeSync = async ({
  originalDoc,
  searchDoc,
  payload,
}) => {
  const doc = originalDoc as Record<string, unknown>;

  const contentText = extractTextFromLexical(doc.content);

  const [conditionNames, themeNames, personaNames] = await Promise.all([
    resolveRelationNames(
      payload,
      doc.conditions as unknown[],
      "conditions",
      "acronym",
    ),
    resolveRelationNames(payload, doc.themes as unknown[], "themes", "name"),
    resolveRelationNames(payload, doc.persona as unknown[], "personas", "name"),
  ]);

  return {
    ...searchDoc,
    title: (doc.title as string) ?? "",
    slug: (doc.slug as string) ?? "",
    description: (doc.description as string) ?? "",
    contentText,
    conditionNames,
    themeNames,
    personaNames,
  };
};
