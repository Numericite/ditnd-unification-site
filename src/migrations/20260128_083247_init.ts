import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_courses_type" AS ENUM('MOOC', 'Webinaire', 'Présentiel');
  CREATE TYPE "public"."enum_practical_guides_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__practical_guides_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "personas" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "conditions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"acronym" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"text_color" varchar NOT NULL,
  	"background_color" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"type" "enum_courses_type" NOT NULL,
  	"theme_id" integer NOT NULL,
  	"persona_id" integer NOT NULL,
  	"condition_id" integer NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "practical_guides" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"content" jsonb,
  	"html" varchar,
  	"view_count" numeric DEFAULT 0,
  	"image_id" integer,
  	"image_banner_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_practical_guides_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "practical_guides_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"conditions_id" integer,
  	"personas_id" integer,
  	"themes_id" integer,
  	"practical_guides_id" integer,
  	"courses_id" integer
  );
  
  CREATE TABLE "_practical_guides_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_content" jsonb,
  	"version_html" varchar,
  	"version_view_count" numeric DEFAULT 0,
  	"version_image_id" integer,
  	"version_image_banner_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__practical_guides_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_practical_guides_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"conditions_id" integer,
  	"personas_id" integer,
  	"themes_id" integer,
  	"practical_guides_id" integer,
  	"courses_id" integer
  );
  
  CREATE TABLE "themes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "journeys_chapter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"chapter_name" varchar NOT NULL
  );
  
  CREATE TABLE "journeys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"journey_name" varchar NOT NULL,
  	"persona_id" integer NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "journeys_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"practical_guides_id" integer,
  	"courses_id" integer
  );
  
  CREATE TABLE "medias" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"personas_id" integer,
  	"conditions_id" integer,
  	"courses_id" integer,
  	"practical_guides_id" integer,
  	"themes_id" integer,
  	"journeys_id" integer,
  	"medias_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_persona_id_personas_id_fk" FOREIGN KEY ("persona_id") REFERENCES "public"."personas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_condition_id_conditions_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."conditions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_image_id_medias_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "practical_guides" ADD CONSTRAINT "practical_guides_image_id_medias_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "practical_guides" ADD CONSTRAINT "practical_guides_image_banner_id_medias_id_fk" FOREIGN KEY ("image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "practical_guides_rels" ADD CONSTRAINT "practical_guides_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."practical_guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "practical_guides_rels" ADD CONSTRAINT "practical_guides_rels_conditions_fk" FOREIGN KEY ("conditions_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "practical_guides_rels" ADD CONSTRAINT "practical_guides_rels_personas_fk" FOREIGN KEY ("personas_id") REFERENCES "public"."personas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "practical_guides_rels" ADD CONSTRAINT "practical_guides_rels_themes_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "practical_guides_rels" ADD CONSTRAINT "practical_guides_rels_practical_guides_fk" FOREIGN KEY ("practical_guides_id") REFERENCES "public"."practical_guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "practical_guides_rels" ADD CONSTRAINT "practical_guides_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_practical_guides_v" ADD CONSTRAINT "_practical_guides_v_parent_id_practical_guides_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."practical_guides"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_practical_guides_v" ADD CONSTRAINT "_practical_guides_v_version_image_id_medias_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_practical_guides_v" ADD CONSTRAINT "_practical_guides_v_version_image_banner_id_medias_id_fk" FOREIGN KEY ("version_image_banner_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_practical_guides_v_rels" ADD CONSTRAINT "_practical_guides_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_practical_guides_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_practical_guides_v_rels" ADD CONSTRAINT "_practical_guides_v_rels_conditions_fk" FOREIGN KEY ("conditions_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_practical_guides_v_rels" ADD CONSTRAINT "_practical_guides_v_rels_personas_fk" FOREIGN KEY ("personas_id") REFERENCES "public"."personas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_practical_guides_v_rels" ADD CONSTRAINT "_practical_guides_v_rels_themes_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_practical_guides_v_rels" ADD CONSTRAINT "_practical_guides_v_rels_practical_guides_fk" FOREIGN KEY ("practical_guides_id") REFERENCES "public"."practical_guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_practical_guides_v_rels" ADD CONSTRAINT "_practical_guides_v_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_chapter" ADD CONSTRAINT "journeys_chapter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys" ADD CONSTRAINT "journeys_persona_id_personas_id_fk" FOREIGN KEY ("persona_id") REFERENCES "public"."personas"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journeys" ADD CONSTRAINT "journeys_image_id_medias_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journeys_rels" ADD CONSTRAINT "journeys_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_rels" ADD CONSTRAINT "journeys_rels_practical_guides_fk" FOREIGN KEY ("practical_guides_id") REFERENCES "public"."practical_guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journeys_rels" ADD CONSTRAINT "journeys_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_personas_fk" FOREIGN KEY ("personas_id") REFERENCES "public"."personas"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_conditions_fk" FOREIGN KEY ("conditions_id") REFERENCES "public"."conditions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_practical_guides_fk" FOREIGN KEY ("practical_guides_id") REFERENCES "public"."practical_guides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_themes_fk" FOREIGN KEY ("themes_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journeys_fk" FOREIGN KEY ("journeys_id") REFERENCES "public"."journeys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_medias_fk" FOREIGN KEY ("medias_id") REFERENCES "public"."medias"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "personas_slug_idx" ON "personas" USING btree ("slug");
  CREATE INDEX "personas_updated_at_idx" ON "personas" USING btree ("updated_at");
  CREATE INDEX "personas_created_at_idx" ON "personas" USING btree ("created_at");
  CREATE UNIQUE INDEX "conditions_slug_idx" ON "conditions" USING btree ("slug");
  CREATE INDEX "conditions_updated_at_idx" ON "conditions" USING btree ("updated_at");
  CREATE INDEX "conditions_created_at_idx" ON "conditions" USING btree ("created_at");
  CREATE INDEX "courses_theme_idx" ON "courses" USING btree ("theme_id");
  CREATE INDEX "courses_persona_idx" ON "courses" USING btree ("persona_id");
  CREATE INDEX "courses_condition_idx" ON "courses" USING btree ("condition_id");
  CREATE INDEX "courses_image_idx" ON "courses" USING btree ("image_id");
  CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE UNIQUE INDEX "practical_guides_slug_idx" ON "practical_guides" USING btree ("slug");
  CREATE INDEX "practical_guides_image_idx" ON "practical_guides" USING btree ("image_id");
  CREATE INDEX "practical_guides_image_banner_idx" ON "practical_guides" USING btree ("image_banner_id");
  CREATE INDEX "practical_guides_updated_at_idx" ON "practical_guides" USING btree ("updated_at");
  CREATE INDEX "practical_guides_created_at_idx" ON "practical_guides" USING btree ("created_at");
  CREATE INDEX "practical_guides__status_idx" ON "practical_guides" USING btree ("_status");
  CREATE INDEX "practical_guides_rels_order_idx" ON "practical_guides_rels" USING btree ("order");
  CREATE INDEX "practical_guides_rels_parent_idx" ON "practical_guides_rels" USING btree ("parent_id");
  CREATE INDEX "practical_guides_rels_path_idx" ON "practical_guides_rels" USING btree ("path");
  CREATE INDEX "practical_guides_rels_conditions_id_idx" ON "practical_guides_rels" USING btree ("conditions_id");
  CREATE INDEX "practical_guides_rels_personas_id_idx" ON "practical_guides_rels" USING btree ("personas_id");
  CREATE INDEX "practical_guides_rels_themes_id_idx" ON "practical_guides_rels" USING btree ("themes_id");
  CREATE INDEX "practical_guides_rels_practical_guides_id_idx" ON "practical_guides_rels" USING btree ("practical_guides_id");
  CREATE INDEX "practical_guides_rels_courses_id_idx" ON "practical_guides_rels" USING btree ("courses_id");
  CREATE INDEX "_practical_guides_v_parent_idx" ON "_practical_guides_v" USING btree ("parent_id");
  CREATE INDEX "_practical_guides_v_version_version_slug_idx" ON "_practical_guides_v" USING btree ("version_slug");
  CREATE INDEX "_practical_guides_v_version_version_image_idx" ON "_practical_guides_v" USING btree ("version_image_id");
  CREATE INDEX "_practical_guides_v_version_version_image_banner_idx" ON "_practical_guides_v" USING btree ("version_image_banner_id");
  CREATE INDEX "_practical_guides_v_version_version_updated_at_idx" ON "_practical_guides_v" USING btree ("version_updated_at");
  CREATE INDEX "_practical_guides_v_version_version_created_at_idx" ON "_practical_guides_v" USING btree ("version_created_at");
  CREATE INDEX "_practical_guides_v_version_version__status_idx" ON "_practical_guides_v" USING btree ("version__status");
  CREATE INDEX "_practical_guides_v_created_at_idx" ON "_practical_guides_v" USING btree ("created_at");
  CREATE INDEX "_practical_guides_v_updated_at_idx" ON "_practical_guides_v" USING btree ("updated_at");
  CREATE INDEX "_practical_guides_v_latest_idx" ON "_practical_guides_v" USING btree ("latest");
  CREATE INDEX "_practical_guides_v_rels_order_idx" ON "_practical_guides_v_rels" USING btree ("order");
  CREATE INDEX "_practical_guides_v_rels_parent_idx" ON "_practical_guides_v_rels" USING btree ("parent_id");
  CREATE INDEX "_practical_guides_v_rels_path_idx" ON "_practical_guides_v_rels" USING btree ("path");
  CREATE INDEX "_practical_guides_v_rels_conditions_id_idx" ON "_practical_guides_v_rels" USING btree ("conditions_id");
  CREATE INDEX "_practical_guides_v_rels_personas_id_idx" ON "_practical_guides_v_rels" USING btree ("personas_id");
  CREATE INDEX "_practical_guides_v_rels_themes_id_idx" ON "_practical_guides_v_rels" USING btree ("themes_id");
  CREATE INDEX "_practical_guides_v_rels_practical_guides_id_idx" ON "_practical_guides_v_rels" USING btree ("practical_guides_id");
  CREATE INDEX "_practical_guides_v_rels_courses_id_idx" ON "_practical_guides_v_rels" USING btree ("courses_id");
  CREATE UNIQUE INDEX "themes_slug_idx" ON "themes" USING btree ("slug");
  CREATE INDEX "themes_updated_at_idx" ON "themes" USING btree ("updated_at");
  CREATE INDEX "themes_created_at_idx" ON "themes" USING btree ("created_at");
  CREATE INDEX "journeys_chapter_order_idx" ON "journeys_chapter" USING btree ("_order");
  CREATE INDEX "journeys_chapter_parent_id_idx" ON "journeys_chapter" USING btree ("_parent_id");
  CREATE INDEX "journeys_persona_idx" ON "journeys" USING btree ("persona_id");
  CREATE INDEX "journeys_image_idx" ON "journeys" USING btree ("image_id");
  CREATE INDEX "journeys_updated_at_idx" ON "journeys" USING btree ("updated_at");
  CREATE INDEX "journeys_created_at_idx" ON "journeys" USING btree ("created_at");
  CREATE INDEX "journeys_rels_order_idx" ON "journeys_rels" USING btree ("order");
  CREATE INDEX "journeys_rels_parent_idx" ON "journeys_rels" USING btree ("parent_id");
  CREATE INDEX "journeys_rels_path_idx" ON "journeys_rels" USING btree ("path");
  CREATE INDEX "journeys_rels_practical_guides_id_idx" ON "journeys_rels" USING btree ("practical_guides_id");
  CREATE INDEX "journeys_rels_courses_id_idx" ON "journeys_rels" USING btree ("courses_id");
  CREATE INDEX "medias_updated_at_idx" ON "medias" USING btree ("updated_at");
  CREATE INDEX "medias_created_at_idx" ON "medias" USING btree ("created_at");
  CREATE UNIQUE INDEX "medias_filename_idx" ON "medias" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_personas_id_idx" ON "payload_locked_documents_rels" USING btree ("personas_id");
  CREATE INDEX "payload_locked_documents_rels_conditions_id_idx" ON "payload_locked_documents_rels" USING btree ("conditions_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_locked_documents_rels_practical_guides_id_idx" ON "payload_locked_documents_rels" USING btree ("practical_guides_id");
  CREATE INDEX "payload_locked_documents_rels_themes_id_idx" ON "payload_locked_documents_rels" USING btree ("themes_id");
  CREATE INDEX "payload_locked_documents_rels_journeys_id_idx" ON "payload_locked_documents_rels" USING btree ("journeys_id");
  CREATE INDEX "payload_locked_documents_rels_medias_id_idx" ON "payload_locked_documents_rels" USING btree ("medias_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "personas" CASCADE;
  DROP TABLE "conditions" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "practical_guides" CASCADE;
  DROP TABLE "practical_guides_rels" CASCADE;
  DROP TABLE "_practical_guides_v" CASCADE;
  DROP TABLE "_practical_guides_v_rels" CASCADE;
  DROP TABLE "themes" CASCADE;
  DROP TABLE "journeys_chapter" CASCADE;
  DROP TABLE "journeys" CASCADE;
  DROP TABLE "journeys_rels" CASCADE;
  DROP TABLE "medias" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_courses_type";
  DROP TYPE "public"."enum_practical_guides_status";
  DROP TYPE "public"."enum__practical_guides_v_version_status";`)
}
