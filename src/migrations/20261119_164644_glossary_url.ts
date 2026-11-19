import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Le glossaire passe de /a-propos/glossaire à /glossaire (redirection dans
// next.config.js) : les liens saisis et les redirections héritées pointent
// directement vers la nouvelle adresse, sans double redirection.
const move = (from: string, to: string) =>
  sql.raw(`
  UPDATE "menu_items" SET "link_internal_url" = '${to}' WHERE "link_internal_url" = '${from}';
  UPDATE "menu_items_children" SET "link_internal_url" = '${to}' WHERE "link_internal_url" = '${from}';
  UPDATE "footer_bottom_links" SET "link_internal_url" = '${to}' WHERE "link_internal_url" = '${from}';
  UPDATE "redirects" SET "to_url" = '${to}' WHERE "to_type" = 'custom' AND "to_url" = '${from}';`)

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(move('/a-propos/glossaire', '/glossaire'))
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(move('/glossaire', '/a-propos/glossaire'))
}
