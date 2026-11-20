import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Payload identifie les lignes de tableau par 24 caractères hexadécimaux.
const rowId = `substr(md5(random()::text || clock_timestamp()::text), 1, 24)`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // L'entrée fixe « Me former » devient un menu éditable, en tête des éléments,
  // avec son libellé éventuellement personnalisé ; masquée, elle n'est pas recréée.
  await db.execute(
    sql.raw(`
  DO $$
  DECLARE
    m record;
    item_id varchar := ${rowId};
  BEGIN
    SELECT "id", "locked_items_courses_title" AS "title" INTO m FROM "menu"
      WHERE coalesce("locked_items_courses_visible", true) LIMIT 1;
    IF m IS NULL THEN RETURN; END IF;

    UPDATE "menu_items" SET "_order" = "_order" + 1 WHERE "_parent_id" = m."id";
    INSERT INTO "menu_items" ("_order", "_parent_id", "id", "title", "kind")
      VALUES (1, m."id", item_id, m."title", 'submenu');
    INSERT INTO "menu_items_children" ("_order", "_parent_id", "id", "title", "link_type", "link_internal_url", "link_external_url") VALUES
      (1, item_id, ${rowId}, 'Présentation', 'internal', '/se-former', NULL),
      (2, item_id, ${rowId}, 'Les formations', 'internal', '/formations', NULL),
      (3, item_id, ${rowId}, 'Le Campus GNCRA', 'external', NULL, 'https://campus.gncra.fr/'),
      (4, item_id, ${rowId}, 'PASS Autisme', 'external', NULL, 'https://cra-paca.centredoc.fr/');
  END $$;

  ALTER TABLE "menu" DROP COLUMN "locked_items_courses_title";
  ALTER TABLE "menu" DROP COLUMN "locked_items_courses_visible";`),
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "menu" ADD COLUMN "locked_items_courses_title" varchar DEFAULT 'Me former' NOT NULL;
  ALTER TABLE "menu" ADD COLUMN "locked_items_courses_visible" boolean DEFAULT true;

  DO $$
  DECLARE
    item record;
  BEGIN
    SELECT i."id", i."_parent_id", i."_order", i."title" INTO item FROM "menu_items" i
      WHERE i."kind" = 'submenu' AND EXISTS (
        SELECT 1 FROM "menu_items_children" c WHERE c."_parent_id" = i."id" AND c."link_internal_url" = '/se-former'
      ) LIMIT 1;
    IF item IS NULL THEN RETURN; END IF;

    UPDATE "menu" SET "locked_items_courses_title" = item."title" WHERE "id" = item."_parent_id";
    DELETE FROM "menu_items_children" WHERE "_parent_id" = item."id";
    DELETE FROM "menu_items" WHERE "id" = item."id";
    UPDATE "menu_items" SET "_order" = "_order" - 1 WHERE "_parent_id" = item."_parent_id" AND "_order" > item."_order";
  END $$;`)
}
