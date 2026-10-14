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
  ALTER TABLE "courses" ADD CONSTRAINT "courses_image_banner_id_medias_id_fk" FOREIGN KEY ("image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_personas_fk" FOREIGN KEY ("personas_id") REFERENCES "public"."personas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses_rels" ADD CONSTRAINT "courses_rels_themes_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "courses_image_banner_idx" ON "courses" USING btree ("image_banner_id");
  CREATE INDEX "courses_rels_personas_id_idx" ON "courses_rels" USING btree ("personas_id");
  CREATE INDEX "courses_rels_themes_id_idx" ON "courses_rels" USING btree ("themes_id");
  UPDATE "courses" SET "published_at" = "created_at";
  UPDATE "courses" SET "image_banner_id" = "image_id", "image_id" = NULL;
  INSERT INTO "courses_rels" ("order", "parent_id", "path", "themes_id")
  SELECT 1, "id", 'themes', "theme_id" FROM "courses" WHERE "theme_id" IS NOT NULL;
  INSERT INTO "courses_rels" ("order", "parent_id", "path", "personas_id")
  SELECT 1, "id", 'persona', "persona_id" FROM "courses" WHERE "persona_id" IS NOT NULL;
  ALTER TABLE "courses" DROP CONSTRAINT "courses_theme_id_themes_id_fk";
  ALTER TABLE "courses" DROP CONSTRAINT "courses_persona_id_personas_id_fk";
  DROP INDEX "courses_theme_idx";
  DROP INDEX "courses_persona_idx";
  ALTER TABLE "courses" DROP COLUMN "theme_id";
  ALTER TABLE "courses" DROP COLUMN "persona_id";`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "courses" ADD COLUMN "theme_id" integer;
  ALTER TABLE "courses" ADD COLUMN "persona_id" integer;
  UPDATE "courses" SET "theme_id" = (
  	SELECT "courses_rels"."themes_id" FROM "courses_rels"
  	WHERE "courses_rels"."parent_id" = "courses"."id"
  		AND "courses_rels"."path" = 'themes'
  		AND "courses_rels"."themes_id" IS NOT NULL
  	ORDER BY "courses_rels"."order" NULLS LAST, "courses_rels"."id"
  	LIMIT 1
  );
  UPDATE "courses" SET "persona_id" = (
  	SELECT "courses_rels"."personas_id" FROM "courses_rels"
  	WHERE "courses_rels"."parent_id" = "courses"."id"
  		AND "courses_rels"."path" = 'persona'
  		AND "courses_rels"."personas_id" IS NOT NULL
  	ORDER BY "courses_rels"."order" NULLS LAST, "courses_rels"."id"
  	LIMIT 1
  );
  UPDATE "courses" SET "image_id" = COALESCE("image_banner_id", "image_id");
  ALTER TABLE "courses" ALTER COLUMN "theme_id" SET NOT NULL;
  ALTER TABLE "courses" ALTER COLUMN "persona_id" SET NOT NULL;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_persona_id_personas_id_fk" FOREIGN KEY ("persona_id") REFERENCES "public"."personas"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "courses_theme_idx" ON "courses" USING btree ("theme_id");
  CREATE INDEX "courses_persona_idx" ON "courses" USING btree ("persona_id");
  DELETE FROM "courses_rels" WHERE "path" IN ('themes', 'persona');
  ALTER TABLE "courses" DROP CONSTRAINT "courses_image_banner_id_medias_id_fk";
  ALTER TABLE "courses_rels" DROP CONSTRAINT "courses_rels_personas_fk";
  ALTER TABLE "courses_rels" DROP CONSTRAINT "courses_rels_themes_fk";
  DROP INDEX "courses_image_banner_idx";
  DROP INDEX "courses_rels_personas_id_idx";
  DROP INDEX "courses_rels_themes_id_idx";
  ALTER TABLE "courses" DROP COLUMN "published_at";
  ALTER TABLE "courses" DROP COLUMN "last_updated_at";
  ALTER TABLE "courses" DROP COLUMN "image_banner_id";
  ALTER TABLE "courses_rels" DROP COLUMN "personas_id";
  ALTER TABLE "courses_rels" DROP COLUMN "themes_id";`);
}
