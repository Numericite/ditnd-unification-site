import {
  type MigrateUpArgs,
  type MigrateDownArgs,
  sql,
} from "@payloadcms/db-postgres";

/**
 * Converts a plain text string into a Lexical richText JSON object.
 * Splits on newlines to create multiple paragraphs.
 */
function textToLexicalJson(text: string): object {
  const lines = text.split("\n").filter((line) => line.length > 0);

  const children =
    lines.length === 0
      ? [
          {
            type: "paragraph",
            format: "",
            indent: 0,
            version: 1,
            children: [],
            direction: null,
            textStyle: "",
            textFormat: 0,
          },
        ]
      : lines.map((line) => ({
          type: "paragraph",
          format: "",
          indent: 0,
          version: 1,
          children: [
            {
              mode: "normal",
              text: line,
              type: "text",
              style: "",
              detail: 0,
              format: 0,
              version: 1,
            },
          ],
          direction: null,
          textStyle: "",
          textFormat: 0,
        }));

  return {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      children,
      direction: null,
    },
  };
}

/**
 * Recursively traverses a Lexical JSON tree and converts string `content`
 * fields in callout/highlight blocks to Lexical richText format.
 */
function migrateContentField(node: any): any {
  if (!node || typeof node !== "object") return node;

  if (Array.isArray(node)) {
    return node.map((item) => migrateContentField(item));
  }

  const result = { ...node };

  // Check if this is a callout or highlight block with a string content
  if (
    result.type === "block" &&
    result.fields &&
    (result.fields.blockType === "callout" ||
      result.fields.blockType === "highlight") &&
    typeof result.fields.content === "string"
  ) {
    result.fields = {
      ...result.fields,
      content: textToLexicalJson(result.fields.content),
    };
  }

  // Recurse into children
  if (result.children) {
    result.children = migrateContentField(result.children);
  }

  // Recurse into root
  if (result.root) {
    result.root = migrateContentField(result.root);
  }

  return result;
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Migrate practical_guides
  const guides = await db.execute(
    sql`SELECT id, content FROM practical_guides WHERE content IS NOT NULL`,
  );

  for (const row of guides.rows) {
    const content = row.content as any;
    if (!content?.root) continue;

    const migrated = migrateContentField(content);

    if (JSON.stringify(migrated) !== JSON.stringify(content)) {
      await db.execute(
        sql`UPDATE practical_guides SET content = ${JSON.stringify(migrated)}::jsonb WHERE id = ${row.id}`,
      );
    }
  }

  // Migrate practical_guides versions
  const versions = await db.execute(
    sql`SELECT id, version_content FROM _practical_guides_v WHERE version_content IS NOT NULL`,
  );

  for (const row of versions.rows) {
    const content = row.version_content as any;
    if (!content?.root) continue;

    const migrated = migrateContentField(content);

    if (JSON.stringify(migrated) !== JSON.stringify(content)) {
      await db.execute(
        sql`UPDATE _practical_guides_v SET version_content = ${JSON.stringify(migrated)}::jsonb WHERE id = ${row.id}`,
      );
    }
  }

  // Migrate footer content fields
  const footerColumns = [
    "accessibility_content",
    "legal_notice_content",
    "cgu_content",
    "terms_of_use_content",
  ];

  for (const col of footerColumns) {
    const footerRows = await db.execute(
      sql.raw(`SELECT id, "${col}" FROM footer WHERE "${col}" IS NOT NULL`),
    );

    for (const row of footerRows.rows) {
      const content = row[col] as any;
      if (!content?.root) continue;

      const migrated = migrateContentField(content);

      if (JSON.stringify(migrated) !== JSON.stringify(content)) {
        await db.execute(
          sql.raw(
            `UPDATE footer SET "${col}" = '${JSON.stringify(migrated).replace(/'/g, "''")}'::jsonb WHERE id = ${row.id}`,
          ),
        );
      }
    }
  }
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  // This migration converts rich text objects back to plain strings is not straightforward
  // and would lose formatting. Skipping down migration.
}
