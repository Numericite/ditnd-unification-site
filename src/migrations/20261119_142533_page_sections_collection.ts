import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// La rubrique « À propos » existait en dur (enum) : elle devient un document,
// et les pages qui y étaient rangées y sont rattachées. Les URLs ne changent pas.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "page_sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "pages" ADD COLUMN "section_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_section_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "page_sections_id" integer;
  CREATE UNIQUE INDEX "page_sections_slug_idx" ON "page_sections" USING btree ("slug");
  CREATE INDEX "page_sections_updated_at_idx" ON "page_sections" USING btree ("updated_at");
  CREATE INDEX "page_sections_created_at_idx" ON "page_sections" USING btree ("created_at");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_section_id_page_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."page_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_section_id_page_sections_id_fk" FOREIGN KEY ("version_section_id") REFERENCES "public"."page_sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_page_sections_fk" FOREIGN KEY ("page_sections_id") REFERENCES "public"."page_sections"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_section_idx" ON "pages" USING btree ("section_id");
  CREATE INDEX "_pages_v_version_version_section_idx" ON "_pages_v" USING btree ("version_section_id");
  CREATE INDEX "payload_locked_documents_rels_page_sections_id_idx" ON "payload_locked_documents_rels" USING btree ("page_sections_id");

  INSERT INTO "page_sections" ("title", "slug", "description") VALUES (
    'À propos',
    'a-propos',
    'À propos de la Maison de l''autisme : découvrez la Maison de l''autisme, le GNCRA et les Centres Ressources Autisme.'
  );
  UPDATE "pages" SET "section_id" = (SELECT "id" FROM "page_sections" WHERE "slug" = 'a-propos')
    WHERE "section" = 'a-propos';
  UPDATE "_pages_v" SET "version_section_id" = (SELECT "id" FROM "page_sections" WHERE "slug" = 'a-propos')
    WHERE "version_section" = 'a-propos';

  ALTER TABLE "pages" DROP COLUMN "section";
  ALTER TABLE "_pages_v" DROP COLUMN "version_section";
  DROP TYPE "public"."enum_pages_section";
  DROP TYPE "public"."enum__pages_v_version_section";`)
}

// Seule la rubrique « À propos » survit au retour arrière : les pages des
// autres rubriques repassent à la racine.
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_section" AS ENUM('a-propos');
  CREATE TYPE "public"."enum__pages_v_version_section" AS ENUM('a-propos');
  ALTER TABLE "pages" ADD COLUMN "section" "enum_pages_section";
  ALTER TABLE "_pages_v" ADD COLUMN "version_section" "enum__pages_v_version_section";

  UPDATE "pages" SET "section" = 'a-propos'
    FROM "page_sections" WHERE "pages"."section_id" = "page_sections"."id" AND "page_sections"."slug" = 'a-propos';
  UPDATE "_pages_v" SET "version_section" = 'a-propos'
    FROM "page_sections" WHERE "_pages_v"."version_section_id" = "page_sections"."id" AND "page_sections"."slug" = 'a-propos';

  ALTER TABLE "pages" DROP CONSTRAINT "pages_section_id_page_sections_id_fk";
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_section_id_page_sections_id_fk";
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_page_sections_fk";
  DROP INDEX "pages_section_idx";
  DROP INDEX "_pages_v_version_version_section_idx";
  DROP INDEX "payload_locked_documents_rels_page_sections_id_idx";
  ALTER TABLE "pages" DROP COLUMN "section_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_section_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "page_sections_id";
  DROP TABLE "page_sections" CASCADE;`)
}
