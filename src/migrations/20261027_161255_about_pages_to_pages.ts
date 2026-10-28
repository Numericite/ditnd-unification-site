import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Le global « about » (3 onglets) devient 3 pages de la collection « pages »,
// rangées dans la rubrique « À propos » pour conserver leurs URL
// (/a-propos/{slug}). Les dates restent masquées comme sur les anciennes pages
// et leur meta description est reprise. Une page dont le slug est déjà pris
// n'est pas créée. Le down recrée le global à partir de ces pages.
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
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
        req,
      })
      if (existing.docs.length) {
        payload.logger.warn(`Page « ${slug} » déjà existante : onglet « ${title} » non migré.`)
        continue
      }

      await payload.create({
        collection: 'pages',
        data: {
          title,
          slug,
          section: 'a-propos',
          content: about[`${tab}_content`] as never,
          imageBanner: (about[`${tab}_image_banner_id`] as number | null) ?? null,
          showDates: false,
          meta: { description: `${title} : ${description}` },
          _status: 'published',
        },
        req,
      })
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

  const pages = new Map<string, AboutRow>()
  for (const { slug } of ABOUT_PAGES) {
    const page = (
      await db.execute(sql`
        SELECT "id", "title", "content", "image_banner_id" FROM "pages"
        WHERE "slug" = ${slug} AND "section" = 'a-propos'
      `)
    ).rows[0] as AboutRow | undefined
    if (page) pages.set(slug, page)
  }

  const [mda, gncra, cras] = ABOUT_PAGES.map(({ slug }) => pages.get(slug))
  if (mda && gncra && cras) {
    await db.execute(sql`
      INSERT INTO "about" (
        "maison_de_l_autisme_title", "maison_de_l_autisme_image_banner_id", "maison_de_l_autisme_content",
        "gncra_title", "gncra_image_banner_id", "gncra_content",
        "cras_title", "cras_image_banner_id", "cras_content",
        "updated_at", "created_at"
      ) VALUES (
        ${mda.title}, ${mda.image_banner_id}, ${JSON.stringify(mda.content)}::jsonb,
        ${gncra.title}, ${gncra.image_banner_id}, ${JSON.stringify(gncra.content)}::jsonb,
        ${cras.title}, ${cras.image_banner_id}, ${JSON.stringify(cras.content)}::jsonb,
        now(), now()
      )
    `)
  } else {
    payload.logger.warn('Pages « À propos » incomplètes : le global « about » est recréé vide.')
  }

  for (const page of pages.values()) {
    await payload.delete({ collection: 'pages', id: page.id as number, req })
  }

  await db.execute(sql`
  ALTER TABLE "pages" DROP COLUMN "show_dates";
  ALTER TABLE "pages" DROP COLUMN "section";
  ALTER TABLE "_pages_v" DROP COLUMN "version_show_dates";
  ALTER TABLE "_pages_v" DROP COLUMN "version_section";
  DROP TYPE "public"."enum_pages_section";
  DROP TYPE "public"."enum__pages_v_version_section";`)
}
