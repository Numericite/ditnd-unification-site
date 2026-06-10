import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Dédoublonner les slugs existants avant d'ajouter les index uniques :
  // les doublons reçoivent un suffixe "-<id>" (l'id garantit l'unicité)
  await db.execute(sql`
    WITH duplicates AS (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY id) AS rn
      FROM "practical_guides"
    )
    UPDATE "practical_guides" p
    SET slug = p.slug || '-' || p.id::text
    FROM duplicates d
    WHERE p.id = d.id AND d.rn > 1;
  `)

  await db.execute(sql`
    WITH duplicates AS (
      SELECT id, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY id) AS rn
      FROM "courses"
    )
    UPDATE "courses" c
    SET slug = c.slug || '-' || c.id::text
    FROM duplicates d
    WHERE c.id = d.id AND d.rn > 1;
  `)

  await db.execute(sql`
    CREATE UNIQUE INDEX "practical_guides_slug_idx" ON "practical_guides" USING btree ("slug");
    CREATE INDEX "_practical_guides_v_version_version_slug_idx" ON "_practical_guides_v" USING btree ("version_slug");
    CREATE UNIQUE INDEX "courses_slug_idx" ON "courses" USING btree ("slug");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX "practical_guides_slug_idx";
    DROP INDEX "_practical_guides_v_version_version_slug_idx";
    DROP INDEX "courses_slug_idx";
  `)
}
