import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

const title = 'Données personnelles et cookies'

const block = (node: Record<string, unknown>, text: string) => ({
  ...node,
  format: '',
  indent: 0,
  version: 1,
  children: [{ mode: 'normal', text, type: 'text', style: '', detail: 0, format: 0, version: 1 }],
  direction: null,
})
const paragraph = (text: string) => block({ type: 'paragraph', textStyle: '', textFormat: 0 }, text)
const heading = (text: string) => block({ type: 'heading', tag: 'h2' }, text)

// Text of the former hard-coded /gestion-des-cookies page, so the page keeps its content
const content = {
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    children: [
      paragraph(
        "Ce site utilise des cookies déposés par des services tiers pour certaines fonctionnalités. Vous pouvez choisir, pour chacune d'elles, d'autoriser ou de refuser le dépôt de ces cookies.",
      ),
      heading('Vidéos YouTube'),
      paragraph(
        "Certaines pages du site intègrent des vidéos hébergées sur YouTube. Si vous n'autorisez pas ces cookies, la vidéo est remplacée par un message vous proposant de l'autoriser au cas par cas.",
      ),
      heading('Cartographie'),
      paragraph(
        "Certaines pages du site intègrent des cartes interactives (fonds de carte IGN et données géographiques). Si vous n'autorisez pas ces cookies, la carte est remplacée par un message vous proposant de l'autoriser.",
      ),
      heading("Mesure d'audience (Matomo)"),
      paragraph(
        "Ce site utilise Matomo pour mesurer sa fréquentation. Si vous n'autorisez pas ces cookies, votre navigation n'est pas suivie par cet outil.",
      ),
    ],
    direction: null,
  },
}

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer" ADD COLUMN "personal_data_title" varchar;
  ALTER TABLE "footer" ADD COLUMN "personal_data_content" jsonb;`)
  await db.execute(sql`
   UPDATE "footer" SET "personal_data_title" = ${title}, "personal_data_content" = ${JSON.stringify(content)}::jsonb;`)
  await db.execute(sql`
   ALTER TABLE "footer" ALTER COLUMN "personal_data_title" SET NOT NULL;
  ALTER TABLE "footer" ALTER COLUMN "personal_data_content" SET NOT NULL;`)
  // The page moved from /gestion-des-cookies: point legacy redirects straight at it
  await db.execute(sql`
   UPDATE "redirects" SET "to_url" = '/donnees-personnelles' WHERE "to_type" = 'custom' AND "to_url" = '/gestion-des-cookies';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "redirects" SET "to_url" = '/gestion-des-cookies' WHERE "to_type" = 'custom' AND "to_url" = '/donnees-personnelles';`)
  await db.execute(sql`
   ALTER TABLE "footer" DROP COLUMN "personal_data_title";
  ALTER TABLE "footer" DROP COLUMN "personal_data_content";`)
}
