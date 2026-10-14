import {
	type MigrateUpArgs,
	type MigrateDownArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_courses_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__courses_v_version_type" AS ENUM('MOOC', 'Webinaire', 'Présentiel');
  CREATE TYPE "public"."enum__courses_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "_courses_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_link" varchar,
  	"version_type" "enum__courses_v_version_type",
  	"version_content" jsonb,
  	"version_theme_id" integer,
  	"version_persona_id" integer,
  	"version_image_id" integer,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__courses_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_courses_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"conditions_id" integer
  );
  
  ALTER TABLE "courses" ALTER COLUMN "title" DROP NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "link" DROP NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "type" DROP NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "theme_id" DROP NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "persona_id" DROP NOT NULL;
  ALTER TABLE "courses" ADD COLUMN "_status" "enum_courses_status" DEFAULT 'draft';
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_parent_id_courses_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_theme_id_themes_id_fk" FOREIGN KEY ("version_theme_id") REFERENCES "public"."themes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_persona_id_personas_id_fk" FOREIGN KEY ("version_persona_id") REFERENCES "public"."personas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_image_id_medias_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_meta_image_id_medias_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_courses_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_conditions_fk" FOREIGN KEY ("conditions_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "_courses_v_parent_idx" ON "_courses_v" USING btree ("parent_id");
  CREATE INDEX "_courses_v_version_version_slug_idx" ON "_courses_v" USING btree ("version_slug");
  CREATE INDEX "_courses_v_version_version_theme_idx" ON "_courses_v" USING btree ("version_theme_id");
  CREATE INDEX "_courses_v_version_version_persona_idx" ON "_courses_v" USING btree ("version_persona_id");
  CREATE INDEX "_courses_v_version_version_image_idx" ON "_courses_v" USING btree ("version_image_id");
  CREATE INDEX "_courses_v_version_meta_version_meta_image_idx" ON "_courses_v" USING btree ("version_meta_image_id");
  CREATE INDEX "_courses_v_version_version_updated_at_idx" ON "_courses_v" USING btree ("version_updated_at");
  CREATE INDEX "_courses_v_version_version_created_at_idx" ON "_courses_v" USING btree ("version_created_at");
  CREATE INDEX "_courses_v_version_version__status_idx" ON "_courses_v" USING btree ("version__status");
  CREATE INDEX "_courses_v_created_at_idx" ON "_courses_v" USING btree ("created_at");
  CREATE INDEX "_courses_v_updated_at_idx" ON "_courses_v" USING btree ("updated_at");
  CREATE INDEX "_courses_v_latest_idx" ON "_courses_v" USING btree ("latest");
  CREATE INDEX "_courses_v_rels_order_idx" ON "_courses_v_rels" USING btree ("order");
  CREATE INDEX "_courses_v_rels_parent_idx" ON "_courses_v_rels" USING btree ("parent_id");
  CREATE INDEX "_courses_v_rels_path_idx" ON "_courses_v_rels" USING btree ("path");
  CREATE INDEX "_courses_v_rels_conditions_id_idx" ON "_courses_v_rels" USING btree ("conditions_id");
  CREATE INDEX "courses__status_idx" ON "courses" USING btree ("_status");`)

  // Les formations existantes étaient toutes visibles sur le site : on les
  // considère comme publiées et on leur crée une version initiale pour que
  // l'admin affiche correctement leur statut et leur historique.
  await db.execute(sql`
   UPDATE "courses" SET "_status" = 'published';

  INSERT INTO "_courses_v" (
  	"parent_id",
  	"version_title",
  	"version_slug",
  	"version_description",
  	"version_link",
  	"version_type",
  	"version_content",
  	"version_theme_id",
  	"version_persona_id",
  	"version_image_id",
  	"version_meta_title",
  	"version_meta_description",
  	"version_meta_image_id",
  	"version_updated_at",
  	"version_created_at",
  	"version__status",
  	"created_at",
  	"updated_at",
  	"latest"
  )
  SELECT
  	"id",
  	"title",
  	"slug",
  	"description",
  	"link",
  	"type"::text::"enum__courses_v_version_type",
  	"content",
  	"theme_id",
  	"persona_id",
  	"image_id",
  	"meta_title",
  	"meta_description",
  	"meta_image_id",
  	"updated_at",
  	"created_at",
  	'published',
  	"updated_at",
  	"updated_at",
  	true
  FROM "courses";

  -- Dans les tables de versions, les chemins des relations sont préfixés par "version."
  INSERT INTO "_courses_v_rels" ("order", "parent_id", "path", "conditions_id")
  SELECT r."order", v."id", 'version.' || r."path", r."conditions_id"
  FROM "courses_rels" r
  JOIN "_courses_v" v ON v."parent_id" = r."parent_id";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Les brouillons jamais publiés peuvent contenir des champs vides,
  // incompatibles avec les contraintes NOT NULL restaurées ci-dessous :
  // on supprime uniquement ces brouillons incomplets.
  await db.execute(sql`
   ALTER TABLE "_courses_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_courses_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "_courses_v" CASCADE;
  DROP TABLE "_courses_v_rels" CASCADE;
  DELETE FROM "courses"
  WHERE "_status" = 'draft'
  	AND (
  		"title" IS NULL OR "slug" IS NULL OR "description" IS NULL
  		OR "link" IS NULL OR "type" IS NULL
  		OR "theme_id" IS NULL OR "persona_id" IS NULL
  	);
  DROP INDEX "courses__status_idx";
  ALTER TABLE "courses" ALTER COLUMN "title" SET NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "link" SET NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "type" SET NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "theme_id" SET NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "persona_id" SET NOT NULL;
  ALTER TABLE "courses" DROP COLUMN "_status";
  DROP TYPE "public"."enum_courses_status";
  DROP TYPE "public"."enum__courses_v_version_type";
  DROP TYPE "public"."enum__courses_v_version_status";`)
}
