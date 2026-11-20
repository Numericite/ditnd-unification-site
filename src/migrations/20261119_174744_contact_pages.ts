import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Les formulaires de contact quittent leurs pages codées en dur (contenu dans
// le global footer) pour des pages CMS de la rubrique « Contact », qui portent
// le formulaire via le champ « module ». Les anciennes adresses redirigent vers
// ces pages et les liens saisis pointent directement sur les nouvelles.
// En SQL plutôt qu'avec l'API Payload : celle-ci lit les colonnes de la config
// actuelle, qui peuvent ne pas encore exister à ce point de l'historique.
// IF NOT EXISTS : une base de dev poussée peut déjà avoir les colonnes.
const CONTACT_PAGES = [
  {
    column: 'contact_particuliers',
    module: 'contact-particuliers',
    slug: 'particuliers',
    from: '/contact-particuliers',
    description:
      "Adressez vos questions sur l'autisme et les troubles du neurodéveloppement à la Maison de l'autisme.",
  },
  {
    column: 'contact_pros_cra',
    module: 'contact-pros-cra',
    slug: 'professionnels',
    from: '/contact-pros-cra',
    description:
      'Formulaire de contact dédié aux professionnels des Centres Ressources Autisme (CRA).',
  },
] as const

const SECTION_SLUG = 'contact'

const emptyRichText = JSON.stringify({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [],
        direction: null,
        textStyle: '',
        textFormat: 0,
      },
    ],
    direction: null,
  },
})

const move = (from: string, to: string) =>
  sql.raw(`
  UPDATE "menu_items" SET "link_internal_url" = '${to}' WHERE "link_internal_url" = '${from}';
  UPDATE "menu_items_children" SET "link_internal_url" = '${to}' WHERE "link_internal_url" = '${from}';
  UPDATE "footer_bottom_links" SET "link_internal_url" = '${to}' WHERE "link_internal_url" = '${from}';
  UPDATE "home_blocks_contact" SET "contact_form_url" = '${to}' WHERE "contact_form_url" = '${from}';`)

const newPath = (slug: string) => `/${SECTION_SLUG}/${slug}`

type Db = MigrateUpArgs['db']
type FooterRow = Record<string, unknown>

const firstId = async (db: Db, query: ReturnType<typeof sql>) =>
  ((await db.execute(query)).rows[0]?.id as number | undefined) ?? null

// Fait pointer une redirection (existante ou non) vers une page, par référence.
const redirectToPage = async (db: Db, redirectId: number, pageId: number) => {
  await db.execute(sql`
    UPDATE "redirects" SET "to_type" = 'reference', "to_url" = NULL, "updated_at" = now()
    WHERE "id" = ${redirectId}`)
  await db.execute(sql`
    DELETE FROM "redirects_rels" WHERE "parent_id" = ${redirectId} AND "path" = 'to.reference'`)
  await db.execute(sql`
    INSERT INTO "redirects_rels" ("parent_id", "path", "pages_id")
    VALUES (${redirectId}, 'to.reference', ${pageId})`)
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_module" AS ENUM('contact-particuliers', 'contact-pros-cra');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_version_module" AS ENUM('contact-particuliers', 'contact-pros-cra');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "module" "enum_pages_module";
  ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_module" "enum__pages_v_version_module";`)

  const footer = (await db.execute(sql`SELECT * FROM "footer" LIMIT 1`)).rows[0] as
    | FooterRow
    | undefined

  // Base vide (seed à venir) : le seed crée lui-même la rubrique et les pages.
  if (footer && 'contact_particuliers_title' in footer) {
    const sectionId =
      (await firstId(db, sql`SELECT "id" FROM "page_sections" WHERE "slug" = ${SECTION_SLUG} LIMIT 1`)) ??
      (await firstId(
        db,
        sql`INSERT INTO "page_sections" ("title", "slug") VALUES ('Contact', ${SECTION_SLUG}) RETURNING "id"`,
      ))

    for (const page of CONTACT_PAGES) {
      let pageId = await firstId(
        db,
        sql`SELECT "id" FROM "pages" WHERE "slug" = ${page.slug} AND "section_id" = ${sectionId} LIMIT 1`,
      )

      if (pageId) {
        await db.execute(sql`
          UPDATE "pages" SET "module" = ${page.module}::"enum_pages_module"
          WHERE "id" = ${pageId} AND "module" IS NULL`)
        await db.execute(sql`
          UPDATE "_pages_v" SET "version_module" = ${page.module}::"enum__pages_v_version_module"
          WHERE "parent_id" = ${pageId} AND "latest" AND "version_module" IS NULL`)
      } else {
        const title = footer[`${page.column}_title`] as string
        const content = JSON.stringify(footer[`${page.column}_content`])
        const imageBanner = (footer[`${page.column}_image_banner_id`] as number | null) ?? null
        pageId = await firstId(
          db,
          sql`
          INSERT INTO "pages" (
            "title", "slug", "section_id", "module", "content", "image_banner_id",
            "show_dates", "published_at", "meta_description", "_status"
          ) VALUES (
            ${title}, ${page.slug}, ${sectionId}, ${page.module}::"enum_pages_module",
            ${content}::jsonb, ${imageBanner}, false, now(), ${page.description}, 'published'
          ) RETURNING "id"`,
        )
        await db.execute(sql`
          INSERT INTO "_pages_v" (
            "parent_id", "version_title", "version_slug", "version_section_id", "version_module",
            "version_content", "version_image_banner_id", "version_show_dates",
            "version_published_at", "version_meta_description", "version__status",
            "version_updated_at", "version_created_at", "latest"
          ) VALUES (
            ${pageId}, ${title}, ${page.slug}, ${sectionId},
            ${page.module}::"enum__pages_v_version_module", ${content}::jsonb, ${imageBanner},
            false, now(), ${page.description}, 'published', now(), now(), true
          )`)
      }
      if (!pageId) throw new Error(`Page « ${page.slug} » introuvable après création`)

      const redirectId =
        (await firstId(db, sql`SELECT "id" FROM "redirects" WHERE "from" = ${page.from} LIMIT 1`)) ??
        (await firstId(db, sql`INSERT INTO "redirects" ("from") VALUES (${page.from}) RETURNING "id"`))
      if (redirectId) await redirectToPage(db, redirectId, pageId)

      const { rows: legacy } = await db.execute(sql`
        SELECT "id" FROM "redirects" WHERE "to_type" = 'custom' AND "to_url" = ${page.from}`)
      for (const { id } of legacy) await redirectToPage(db, id as number, pageId)

      await db.execute(move(page.from, newPath(page.slug)))
    }
  }

  await db.execute(sql`
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_pros_cra_title";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_pros_cra_image_banner_id";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_pros_cra_content";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_particuliers_title";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_particuliers_image_banner_id";
  ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_particuliers_content";`)
}

// Restaure les onglets du footer depuis les pages de contact. Les pages, la
// rubrique et les redirections restent : elles sont masquées par les routes en
// dur revenues avec le code.
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "footer" ADD COLUMN "contact_pros_cra_title" varchar NOT NULL DEFAULT 'Formulaire de contact réservé aux professionnels des CRA';
  ALTER TABLE "footer" ADD COLUMN "contact_pros_cra_image_banner_id" integer;
  ALTER TABLE "footer" ADD COLUMN "contact_pros_cra_content" jsonb NOT NULL DEFAULT ${sql.raw(`'${emptyRichText}'::jsonb`)};
  ALTER TABLE "footer" ADD COLUMN "contact_particuliers_title" varchar NOT NULL DEFAULT 'Adressez-nous vos questions sur l''autisme et les TND';
  ALTER TABLE "footer" ADD COLUMN "contact_particuliers_image_banner_id" integer;
  ALTER TABLE "footer" ADD COLUMN "contact_particuliers_content" jsonb NOT NULL DEFAULT ${sql.raw(`'${emptyRichText}'::jsonb`)};
  ALTER TABLE "footer" ALTER COLUMN "contact_pros_cra_title" DROP DEFAULT;
  ALTER TABLE "footer" ALTER COLUMN "contact_pros_cra_content" DROP DEFAULT;
  ALTER TABLE "footer" ALTER COLUMN "contact_particuliers_title" DROP DEFAULT;
  ALTER TABLE "footer" ALTER COLUMN "contact_particuliers_content" DROP DEFAULT;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_contact_pros_cra_image_banner_id_medias_id_fk" FOREIGN KEY ("contact_pros_cra_image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "footer" ADD CONSTRAINT "footer_contact_particuliers_image_banner_id_medias_id_fk" FOREIGN KEY ("contact_particuliers_image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "footer_contact_pros_cra_contact_pros_cra_image_banner_idx" ON "footer" USING btree ("contact_pros_cra_image_banner_id");
  CREATE INDEX "footer_contact_particuliers_contact_particuliers_image_b_idx" ON "footer" USING btree ("contact_particuliers_image_banner_id");`)

  for (const page of CONTACT_PAGES) {
    await db.execute(sql.raw(`
    UPDATE "footer" SET
      "${page.column}_title" = p."title",
      "${page.column}_content" = p."content",
      "${page.column}_image_banner_id" = p."image_banner_id"
    FROM (
      SELECT "title", "content", "image_banner_id" FROM "pages"
      WHERE "module" = '${page.module}' AND "content" IS NOT NULL
      ORDER BY "id" LIMIT 1
    ) p;`))
    await db.execute(move(newPath(page.slug), page.from))
  }

  await db.execute(sql`
  ALTER TABLE "pages" DROP COLUMN "module";
  ALTER TABLE "_pages_v" DROP COLUMN "version_module";
  DROP TYPE "public"."enum_pages_module";
  DROP TYPE "public"."enum__pages_v_version_module";`)
}
