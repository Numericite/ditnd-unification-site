import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Le global « about » devient 3 pages de la rubrique « À propos » (URL conservées).
// En SQL plutôt qu'avec l'API Payload : celle-ci lit les colonnes de la config
// actuelle, qui n'existent pas encore à ce point de l'historique.
// IF NOT EXISTS : une base de dev poussée peut déjà avoir les colonnes.
const ABOUT_PAGES = [
  {
    tab: 'maison_de_l_autisme',
    slug: 'maison-de-l-autisme',
    description: "découvrez la Maison de l'autisme, site national d'informations sur l'autisme et les troubles du neurodéveloppement.",
  },
  {
    tab: 'gncra',
    slug: 'gncra',
    description: 'découvrez le Groupement National des Centres Ressources Autisme (GNCRA).',
  },
  {
    tab: 'cras',
    slug: 'cra',
    description: 'découvrez les Centres Ressources Autisme (CRA) répartis sur le territoire français.',
  },
] as const

type AboutRow = Record<string, unknown>

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pages_section" AS ENUM('a-propos');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum__pages_v_version_section" AS ENUM('a-propos');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "show_dates" boolean DEFAULT true;
  ALTER TABLE "pages" ADD COLUMN IF NOT EXISTS "section" "enum_pages_section";
  ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_show_dates" boolean DEFAULT true;
  ALTER TABLE "_pages_v" ADD COLUMN IF NOT EXISTS "version_section" "enum__pages_v_version_section";`)

  const { rows } = await db.execute(sql`SELECT to_regclass('public.about') IS NOT NULL AS "exists"`)
  if (!rows[0]?.exists) return

  const about = (await db.execute(sql`SELECT * FROM "about" LIMIT 1`)).rows[0] as AboutRow | undefined

  if (about) {
    for (const { tab, slug, description } of ABOUT_PAGES) {
      const title = about[`${tab}_title`] as string
      const existing = await db.execute(sql`SELECT 1 FROM "pages" WHERE "slug" = ${slug} LIMIT 1`)
      if (existing.rows.length) {
        throw new Error(
          `Page « ${slug} » déjà existante : renommez-la avant de relancer la migration (onglet « ${title} »)`,
        )
      }

      const content = JSON.stringify(about[`${tab}_content`])
      const imageBanner = (about[`${tab}_image_banner_id`] as number | null) ?? null
      const publishedAt = (about.created_at as string | null) ?? null
      const metaDescription = `${title} : ${description}`

      const inserted = await db.execute(sql`
        INSERT INTO "pages" (
          "title", "slug", "section", "content", "image_banner_id", "show_dates",
          "published_at", "meta_description", "_status"
        ) VALUES (
          ${title}, ${slug}, 'a-propos', ${content}::jsonb, ${imageBanner}, false,
          ${publishedAt}::timestamptz, ${metaDescription}, 'published'
        ) RETURNING "id"`)
      const pageId = inserted.rows[0]?.id as number

      await db.execute(sql`
        INSERT INTO "_pages_v" (
          "parent_id", "version_title", "version_slug", "version_section", "version_content",
          "version_image_banner_id", "version_show_dates", "version_published_at",
          "version_meta_description", "version__status", "version_updated_at",
          "version_created_at", "latest"
        ) VALUES (
          ${pageId}, ${title}, ${slug}, 'a-propos', ${content}::jsonb,
          ${imageBanner}, false, ${publishedAt}::timestamptz,
          ${metaDescription}, 'published', now(),
          now(), true
        )`)
    }
  }

  await db.execute(sql`DROP TABLE "about" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"maison_de_l_autisme_title" varchar NOT NULL,
  	"maison_de_l_autisme_image_banner_id" integer,
  	"maison_de_l_autisme_content" jsonb NOT NULL,
  	"gncra_title" varchar NOT NULL,
  	"gncra_image_banner_id" integer,
  	"gncra_content" jsonb NOT NULL,
  	"cras_title" varchar NOT NULL,
  	"cras_image_banner_id" integer,
  	"cras_content" jsonb NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "about" ADD CONSTRAINT "about_maison_de_l_autisme_image_banner_id_medias_id_fk" FOREIGN KEY ("maison_de_l_autisme_image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_gncra_image_banner_id_medias_id_fk" FOREIGN KEY ("gncra_image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_cras_image_banner_id_medias_id_fk" FOREIGN KEY ("cras_image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_maison_de_l_autisme_maison_de_l_autisme_image_bann_idx" ON "about" USING btree ("maison_de_l_autisme_image_banner_id");
  CREATE INDEX "about_gncra_gncra_image_banner_idx" ON "about" USING btree ("gncra_image_banner_id");
  CREATE INDEX "about_cras_cras_image_banner_idx" ON "about" USING btree ("cras_image_banner_id");`)

  type AboutPage = { id: number; title: string; imageBanner: number | null; content: unknown; publishedAt: string | null }
  const pages: (AboutPage | undefined)[] = []
  for (const { slug } of ABOUT_PAGES) {
    const { rows } = await db.execute(sql`
      SELECT "id", "title", "image_banner_id" AS "imageBanner", "content", "published_at" AS "publishedAt"
      FROM "pages" WHERE "slug" = ${slug} AND "section" = 'a-propos' LIMIT 1`)
    pages.push(rows[0] as AboutPage | undefined)
  }

  const [mda, gncra, cras] = pages
  if (mda && gncra && cras) {
    await db.execute(sql`
      INSERT INTO "about" (
        "maison_de_l_autisme_title", "maison_de_l_autisme_image_banner_id", "maison_de_l_autisme_content",
        "gncra_title", "gncra_image_banner_id", "gncra_content",
        "cras_title", "cras_image_banner_id", "cras_content",
        "updated_at", "created_at"
      ) VALUES (
        ${mda.title}, ${mda.imageBanner ?? null}, ${JSON.stringify(mda.content)}::jsonb,
        ${gncra.title}, ${gncra.imageBanner ?? null}, ${JSON.stringify(gncra.content)}::jsonb,
        ${cras.title}, ${cras.imageBanner ?? null}, ${JSON.stringify(cras.content)}::jsonb,
        now(), ${mda.publishedAt ?? null}::timestamptz
      )
    `)
  } else {
    payload.logger.warn('Pages « À propos » incomplètes : le global « about » est recréé vide.')
  }

  for (const page of pages) {
    if (!page) continue
    await db.execute(sql`DELETE FROM "_pages_v" WHERE "parent_id" = ${page.id}`)
    await db.execute(sql`DELETE FROM "pages" WHERE "id" = ${page.id}`)
  }

  await db.execute(sql`
  ALTER TABLE "pages" DROP COLUMN "show_dates";
  ALTER TABLE "pages" DROP COLUMN "section";
  ALTER TABLE "_pages_v" DROP COLUMN "version_show_dates";
  ALTER TABLE "_pages_v" DROP COLUMN "version_section";
  DROP TYPE "public"."enum_pages_section";
  DROP TYPE "public"."enum__pages_v_version_section";`)
}
