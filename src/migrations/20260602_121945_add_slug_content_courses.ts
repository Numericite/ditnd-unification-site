import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Ajouter les colonnes en nullable pour ne pas bloquer les lignes existantes
  await db.execute(sql`
    ALTER TABLE "courses" ADD COLUMN "slug" varchar;
    ALTER TABLE "courses" ADD COLUMN "content" jsonb;
  `)

  // 2. Remplir les slugs des formations existantes depuis leur titre
  const result = await db.execute(sql`SELECT id, title FROM "courses" WHERE slug IS NULL`)

  const seen = new Set<string>()
  for (const row of result.rows as { id: number; title: string }[]) {
    const base = slugify(row.title)
    let candidate = base
    let counter = 1
    while (seen.has(candidate)) {
      counter++
      candidate = `${base}-${counter}`
    }
    seen.add(candidate)
    await db.execute(sql`UPDATE "courses" SET slug = ${candidate} WHERE id = ${row.id}`)
  }

  // 3. Appliquer la contrainte NOT NULL maintenant que toutes les lignes ont un slug
  await db.execute(sql`ALTER TABLE "courses" ALTER COLUMN "slug" SET NOT NULL`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "courses" DROP COLUMN "slug";
  ALTER TABLE "courses" DROP COLUMN "content";`)
}
