import {
	type MigrateUpArgs,
	type MigrateDownArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "courses" ADD COLUMN "published_at" timestamp(3) with time zone;
  ALTER TABLE "courses" ADD COLUMN "last_updated_at" timestamp(3) with time zone;
  ALTER TABLE "courses" ADD COLUMN "image_banner_id" integer;
  ALTER TABLE "courses_rels" ADD COLUMN "personas_id" integer;
  ALTER TABLE "courses_rels" ADD COLUMN "themes_id" integer;
  ALTER TABLE "_courses_v" ADD COLUMN "version_published_at" timestamp(3) with time zone;
  ALTER TABLE "_courses_v" ADD COLUMN "version_last_updated_at" timestamp(3) with time zone;
  ALTER TABLE "_courses_v" ADD COLUMN "version_image_banner_id" integer;
  ALTER TABLE "_courses_v_rels" ADD COLUMN "personas_id" integer;
  ALTER TABLE "_courses_v_rels" ADD COLUMN "themes_id" integer;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_image_banner_id_medias_id_fk" FOREIGN KEY ("image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_personas_fk" FOREIGN KEY ("personas_id") REFERENCES "public"."personas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_themes_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_image_banner_id_medias_id_fk" FOREIGN KEY ("version_image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_personas_fk" FOREIGN KEY ("personas_id") REFERENCES "public"."personas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_courses_v_rels" ADD CONSTRAINT "_courses_v_rels_themes_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "courses_image_banner_idx" ON "courses" USING btree ("image_banner_id");
  CREATE INDEX "courses_rels_personas_id_idx" ON "courses_rels" USING btree ("personas_id");
  CREATE INDEX "courses_rels_themes_id_idx" ON "courses_rels" USING btree ("themes_id");
  CREATE INDEX "_courses_v_version_version_image_banner_idx" ON "_courses_v" USING btree ("version_image_banner_id");
  CREATE INDEX "_courses_v_rels_personas_id_idx" ON "_courses_v_rels" USING btree ("personas_id");
  CREATE INDEX "_courses_v_rels_themes_id_idx" ON "_courses_v_rels" USING btree ("themes_id");`);

	// L'image existante était saisie comme bannière : elle devient la bannière
	// et l'image à la une reste vide. Thème et persona uniques passent dans les
	// tables de relations, préfixées par "version." côté versions.
	await db.execute(sql`
   UPDATE "courses" SET "published_at" = "created_at";
  UPDATE "courses" SET "image_banner_id" = "image_id", "image_id" = NULL;
  UPDATE "_courses_v" SET "version_published_at" = "version_created_at";
  UPDATE "_courses_v" SET "version_image_banner_id" = "version_image_id", "version_image_id" = NULL;
  INSERT INTO "courses_rels" ("order", "parent_id", "path", "themes_id")
  SELECT 1, "id", 'themes', "theme_id" FROM "courses" WHERE "theme_id" IS NOT NULL;
  INSERT INTO "courses_rels" ("order", "parent_id", "path", "personas_id")
  SELECT 1, "id", 'persona', "persona_id" FROM "courses" WHERE "persona_id" IS NOT NULL;
  INSERT INTO "_courses_v_rels" ("order", "parent_id", "path", "themes_id")
  SELECT 1, "id", 'version.themes', "version_theme_id" FROM "_courses_v" WHERE "version_theme_id" IS NOT NULL;
  INSERT INTO "_courses_v_rels" ("order", "parent_id", "path", "personas_id")
  SELECT 1, "id", 'version.persona', "version_persona_id" FROM "_courses_v" WHERE "version_persona_id" IS NOT NULL;`);

	await db.execute(sql`
   ALTER TABLE "courses" DROP CONSTRAINT "courses_theme_id_themes_id_fk";
  ALTER TABLE "courses" DROP CONSTRAINT "courses_persona_id_personas_id_fk";
  ALTER TABLE "_courses_v" DROP CONSTRAINT "_courses_v_version_theme_id_themes_id_fk";
  ALTER TABLE "_courses_v" DROP CONSTRAINT "_courses_v_version_persona_id_personas_id_fk";
  DROP INDEX "courses_theme_idx";
  DROP INDEX "courses_persona_idx";
  DROP INDEX "_courses_v_version_version_theme_idx";
  DROP INDEX "_courses_v_version_version_persona_idx";
  ALTER TABLE "courses" DROP COLUMN "theme_id";
  ALTER TABLE "courses" DROP COLUMN "persona_id";
  ALTER TABLE "_courses_v" DROP COLUMN "version_theme_id";
  ALTER TABLE "_courses_v" DROP COLUMN "version_persona_id";`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "courses" ADD COLUMN "theme_id" integer;
  ALTER TABLE "courses" ADD COLUMN "persona_id" integer;
  ALTER TABLE "_courses_v" ADD COLUMN "version_theme_id" integer;
  ALTER TABLE "_courses_v" ADD COLUMN "version_persona_id" integer;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_persona_id_personas_id_fk" FOREIGN KEY ("persona_id") REFERENCES "public"."personas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_theme_id_themes_id_fk" FOREIGN KEY ("version_theme_id") REFERENCES "public"."themes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_courses_v" ADD CONSTRAINT "_courses_v_version_persona_id_personas_id_fk" FOREIGN KEY ("version_persona_id") REFERENCES "public"."personas"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "courses_theme_idx" ON "courses" USING btree ("theme_id");
  CREATE INDEX "courses_persona_idx" ON "courses" USING btree ("persona_id");
  CREATE INDEX "_courses_v_version_version_theme_idx" ON "_courses_v" USING btree ("version_theme_id");
  CREATE INDEX "_courses_v_version_version_persona_idx" ON "_courses_v" USING btree ("version_persona_id");`);

	await db.execute(sql`
   UPDATE "courses" SET "theme_id" = (
  	SELECT r."themes_id" FROM "courses_rels" r
  	WHERE r."parent_id" = "courses"."id" AND r."path" = 'themes' AND r."themes_id" IS NOT NULL
  	ORDER BY r."order" NULLS LAST, r."id" LIMIT 1
  );
  UPDATE "courses" SET "persona_id" = (
  	SELECT r."personas_id" FROM "courses_rels" r
  	WHERE r."parent_id" = "courses"."id" AND r."path" = 'persona' AND r."personas_id" IS NOT NULL
  	ORDER BY r."order" NULLS LAST, r."id" LIMIT 1
  );
  UPDATE "_courses_v" SET "version_theme_id" = (
  	SELECT r."themes_id" FROM "_courses_v_rels" r
  	WHERE r."parent_id" = "_courses_v"."id" AND r."path" = 'version.themes' AND r."themes_id" IS NOT NULL
  	ORDER BY r."order" NULLS LAST, r."id" LIMIT 1
  );
  UPDATE "_courses_v" SET "version_persona_id" = (
  	SELECT r."personas_id" FROM "_courses_v_rels" r
  	WHERE r."parent_id" = "_courses_v"."id" AND r."path" = 'version.persona' AND r."personas_id" IS NOT NULL
  	ORDER BY r."order" NULLS LAST, r."id" LIMIT 1
  );
  UPDATE "courses" SET "image_id" = COALESCE("image_banner_id", "image_id");
  UPDATE "_courses_v" SET "version_image_id" = COALESCE("version_image_banner_id", "version_image_id");
  DELETE FROM "courses_rels" WHERE "path" IN ('themes', 'persona');
  DELETE FROM "_courses_v_rels" WHERE "path" IN ('version.themes', 'version.persona');`);

	await db.execute(sql`
   ALTER TABLE "courses" DROP CONSTRAINT "courses_image_banner_id_medias_id_fk";
  ALTER TABLE "courses_rels" DROP CONSTRAINT "courses_rels_personas_fk";
  ALTER TABLE "courses_rels" DROP CONSTRAINT "courses_rels_themes_fk";
  ALTER TABLE "_courses_v" DROP CONSTRAINT "_courses_v_version_image_banner_id_medias_id_fk";
  ALTER TABLE "_courses_v_rels" DROP CONSTRAINT "_courses_v_rels_personas_fk";
  ALTER TABLE "_courses_v_rels" DROP CONSTRAINT "_courses_v_rels_themes_fk";
  DROP INDEX "courses_image_banner_idx";
  DROP INDEX "courses_rels_personas_id_idx";
  DROP INDEX "courses_rels_themes_id_idx";
  DROP INDEX "_courses_v_version_version_image_banner_idx";
  DROP INDEX "_courses_v_rels_personas_id_idx";
  DROP INDEX "_courses_v_rels_themes_id_idx";
  ALTER TABLE "courses" DROP COLUMN "published_at";
  ALTER TABLE "courses" DROP COLUMN "last_updated_at";
  ALTER TABLE "courses" DROP COLUMN "image_banner_id";
  ALTER TABLE "courses_rels" DROP COLUMN "personas_id";
  ALTER TABLE "courses_rels" DROP COLUMN "themes_id";
  ALTER TABLE "_courses_v" DROP COLUMN "version_published_at";
  ALTER TABLE "_courses_v" DROP COLUMN "version_last_updated_at";
  ALTER TABLE "_courses_v" DROP COLUMN "version_image_banner_id";
  ALTER TABLE "_courses_v_rels" DROP COLUMN "personas_id";
  ALTER TABLE "_courses_v_rels" DROP COLUMN "themes_id";`);
}
