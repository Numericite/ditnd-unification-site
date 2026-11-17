import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_blocks_newsletter_socials_type" AS ENUM('facebook', 'github', 'instagram', 'linkedin', 'mastodon', 'tiktok', 'twitch', 'twitter-x', 'vimeo', 'youtube', 'dailymotion', 'telegram', 'threads', 'mail');
  CREATE TABLE "home_blocks_news_carousel" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_persona_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"persona_title" varchar NOT NULL,
  	"persona_description" varchar NOT NULL,
  	"condition_title" varchar NOT NULL,
  	"condition_description" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_most_viewed_guides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "home_blocks_newsletter_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_home_blocks_newsletter_socials_type" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "home_blocks_newsletter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"visible" boolean DEFAULT true,
  	"title" varchar,
  	"description" varchar,
  	"consent_hint" varchar,
  	"social_title" varchar,
  	"block_name" varchar
  );
  
  INSERT INTO "home_blocks_news_carousel" ("_order", "_parent_id", "_path", "id", "visible")
  SELECT 1, h."id", 'sections', substr(md5(random()::text), 1, 24), true FROM "home" h;

  INSERT INTO "home_blocks_persona_tiles" ("_order", "_parent_id", "_path", "id", "visible", "persona_title", "persona_description", "condition_title", "condition_description")
  SELECT 2, h."id", 'sections', substr(md5(random()::text), 1, 24), true,
    h."tiles_persona_title", h."tiles_persona_description", h."tiles_condition_title", h."tiles_condition_description"
  FROM "home" h;

  INSERT INTO "home_blocks_most_viewed_guides" ("_order", "_parent_id", "_path", "id", "visible", "title", "description")
  SELECT 3, h."id", 'sections', substr(md5(random()::text), 1, 24), true,
    h."most_viewed_guides_title", h."most_viewed_guides_description"
  FROM "home" h;

  INSERT INTO "home_blocks_newsletter" ("_order", "_parent_id", "_path", "id", "visible", "title", "description", "consent_hint", "social_title")
  SELECT 4, h."id", 'sections', substr(md5(random()::text), 1, 24), COALESCE(n."enabled", true),
    n."title", n."description", n."consent_hint", n."social_title"
  FROM "home" h
  LEFT JOIN (SELECT * FROM "newsletter" ORDER BY "id" LIMIT 1) n ON true;

  INSERT INTO "home_blocks_newsletter_socials" ("_order", "_parent_id", "id", "type", "url")
  SELECT s."_order", b."id", s."id", s."type"::text::"enum_home_blocks_newsletter_socials_type", s."url"
  FROM "newsletter_socials" s
  CROSS JOIN "home_blocks_newsletter" b
  WHERE s."_parent_id" = (SELECT "id" FROM "newsletter" ORDER BY "id" LIMIT 1);

  DROP TABLE "newsletter_socials" CASCADE;
  DROP TABLE "newsletter" CASCADE;
  ALTER TABLE "home_blocks_news_carousel" ADD CONSTRAINT "home_blocks_news_carousel_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_persona_tiles" ADD CONSTRAINT "home_blocks_persona_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_most_viewed_guides" ADD CONSTRAINT "home_blocks_most_viewed_guides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_newsletter_socials" ADD CONSTRAINT "home_blocks_newsletter_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_blocks_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_blocks_newsletter" ADD CONSTRAINT "home_blocks_newsletter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_blocks_news_carousel_order_idx" ON "home_blocks_news_carousel" USING btree ("_order");
  CREATE INDEX "home_blocks_news_carousel_parent_id_idx" ON "home_blocks_news_carousel" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_news_carousel_path_idx" ON "home_blocks_news_carousel" USING btree ("_path");
  CREATE INDEX "home_blocks_persona_tiles_order_idx" ON "home_blocks_persona_tiles" USING btree ("_order");
  CREATE INDEX "home_blocks_persona_tiles_parent_id_idx" ON "home_blocks_persona_tiles" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_persona_tiles_path_idx" ON "home_blocks_persona_tiles" USING btree ("_path");
  CREATE INDEX "home_blocks_most_viewed_guides_order_idx" ON "home_blocks_most_viewed_guides" USING btree ("_order");
  CREATE INDEX "home_blocks_most_viewed_guides_parent_id_idx" ON "home_blocks_most_viewed_guides" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_most_viewed_guides_path_idx" ON "home_blocks_most_viewed_guides" USING btree ("_path");
  CREATE INDEX "home_blocks_newsletter_socials_order_idx" ON "home_blocks_newsletter_socials" USING btree ("_order");
  CREATE INDEX "home_blocks_newsletter_socials_parent_id_idx" ON "home_blocks_newsletter_socials" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_newsletter_order_idx" ON "home_blocks_newsletter" USING btree ("_order");
  CREATE INDEX "home_blocks_newsletter_parent_id_idx" ON "home_blocks_newsletter" USING btree ("_parent_id");
  CREATE INDEX "home_blocks_newsletter_path_idx" ON "home_blocks_newsletter" USING btree ("_path");
  ALTER TABLE "home" DROP COLUMN "tiles_persona_title";
  ALTER TABLE "home" DROP COLUMN "tiles_persona_description";
  ALTER TABLE "home" DROP COLUMN "tiles_condition_title";
  ALTER TABLE "home" DROP COLUMN "tiles_condition_description";
  ALTER TABLE "home" DROP COLUMN "most_viewed_guides_title";
  ALTER TABLE "home" DROP COLUMN "most_viewed_guides_description";
  DROP TYPE "public"."enum_newsletter_socials_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_newsletter_socials_type" AS ENUM('facebook', 'github', 'instagram', 'linkedin', 'mastodon', 'tiktok', 'twitch', 'twitter-x', 'vimeo', 'youtube', 'dailymotion', 'telegram', 'threads', 'mail');
  CREATE TABLE "newsletter_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"type" "enum_newsletter_socials_type" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "newsletter" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"title" varchar,
  	"description" varchar,
  	"consent_hint" varchar,
  	"social_title" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "home" ADD COLUMN "tiles_persona_title" varchar;
  ALTER TABLE "home" ADD COLUMN "tiles_persona_description" varchar;
  ALTER TABLE "home" ADD COLUMN "tiles_condition_title" varchar;
  ALTER TABLE "home" ADD COLUMN "tiles_condition_description" varchar;
  ALTER TABLE "home" ADD COLUMN "most_viewed_guides_title" varchar;
  ALTER TABLE "home" ADD COLUMN "most_viewed_guides_description" varchar;

  UPDATE "home" h SET
    "tiles_persona_title" = p."persona_title",
    "tiles_persona_description" = p."persona_description",
    "tiles_condition_title" = p."condition_title",
    "tiles_condition_description" = p."condition_description"
  FROM "home_blocks_persona_tiles" p WHERE p."_parent_id" = h."id";

  UPDATE "home" h SET
    "most_viewed_guides_title" = m."title",
    "most_viewed_guides_description" = m."description"
  FROM "home_blocks_most_viewed_guides" m WHERE m."_parent_id" = h."id";

  INSERT INTO "newsletter" ("enabled", "title", "description", "consent_hint", "social_title", "updated_at", "created_at")
  SELECT b."visible", b."title", b."description", b."consent_hint", b."social_title", now(), now()
  FROM "home_blocks_newsletter" b LIMIT 1;

  INSERT INTO "newsletter_socials" ("_order", "_parent_id", "id", "type", "url")
  SELECT s."_order", (SELECT "id" FROM "newsletter" LIMIT 1), s."id", s."type"::text::"enum_newsletter_socials_type", s."url"
  FROM "home_blocks_newsletter_socials" s;

  ALTER TABLE "home" ALTER COLUMN "tiles_persona_title" SET NOT NULL;
  ALTER TABLE "home" ALTER COLUMN "tiles_persona_description" SET NOT NULL;
  ALTER TABLE "home" ALTER COLUMN "tiles_condition_title" SET NOT NULL;
  ALTER TABLE "home" ALTER COLUMN "tiles_condition_description" SET NOT NULL;
  ALTER TABLE "home" ALTER COLUMN "most_viewed_guides_title" SET NOT NULL;
  ALTER TABLE "home" ALTER COLUMN "most_viewed_guides_description" SET NOT NULL;

  DROP TABLE "home_blocks_news_carousel" CASCADE;
  DROP TABLE "home_blocks_persona_tiles" CASCADE;
  DROP TABLE "home_blocks_most_viewed_guides" CASCADE;
  DROP TABLE "home_blocks_newsletter_socials" CASCADE;
  DROP TABLE "home_blocks_newsletter" CASCADE;
  ALTER TABLE "newsletter_socials" ADD CONSTRAINT "newsletter_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."newsletter"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "newsletter_socials_order_idx" ON "newsletter_socials" USING btree ("_order");
  CREATE INDEX "newsletter_socials_parent_id_idx" ON "newsletter_socials" USING btree ("_parent_id");
  DROP TYPE "public"."enum_home_blocks_newsletter_socials_type";`)
}
