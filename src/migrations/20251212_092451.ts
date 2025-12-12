import {
  type MigrateUpArgs,
  type MigrateDownArgs,
  sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
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
  
  CREATE TABLE "persona" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "condition" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"acronym" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "courses" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"theme_id" integer NOT NULL,
  	"persona_id" integer NOT NULL,
  	"condition_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "practical_guide" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"condition_id" integer,
  	"content" jsonb NOT NULL,
  	"html" varchar,
  	"persona_id" integer NOT NULL,
  	"theme_id" integer NOT NULL,
  	"practical_guide_id" integer,
  	"courses_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "theme" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "journey_persona_chapter_practical_guide_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"practical_guide_id" integer
  );
  
  CREATE TABLE "journey_persona_chapter" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"chapter_name" varchar NOT NULL
  );
  
  CREATE TABLE "journey" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"journey_name" varchar NOT NULL,
  	"persona_persona_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"persona_id" integer,
  	"condition_id" integer,
  	"courses_id" integer,
  	"practical_guide_id" integer,
  	"theme_id" integer,
  	"journey_id" integer
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
  ALTER TABLE "courses" ADD CONSTRAINT "courses_theme_id_theme_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."theme"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_persona_id_theme_id_fk" FOREIGN KEY ("persona_id") REFERENCES "public"."theme"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "courses" ADD CONSTRAINT "courses_condition_id_condition_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."condition"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "practical_guide" ADD CONSTRAINT "practical_guide_condition_id_condition_id_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."condition"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "practical_guide" ADD CONSTRAINT "practical_guide_persona_id_persona_id_fk" FOREIGN KEY ("persona_id") REFERENCES "public"."persona"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "practical_guide" ADD CONSTRAINT "practical_guide_theme_id_theme_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."theme"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "practical_guide" ADD CONSTRAINT "practical_guide_practical_guide_id_practical_guide_id_fk" FOREIGN KEY ("practical_guide_id") REFERENCES "public"."practical_guide"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "practical_guide" ADD CONSTRAINT "practical_guide_courses_id_courses_id_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journey_persona_chapter_practical_guide_list" ADD CONSTRAINT "journey_persona_chapter_practical_guide_list_practical_guide_id_practical_guide_id_fk" FOREIGN KEY ("practical_guide_id") REFERENCES "public"."practical_guide"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journey_persona_chapter_practical_guide_list" ADD CONSTRAINT "journey_persona_chapter_practical_guide_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journey_persona_chapter"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journey_persona_chapter" ADD CONSTRAINT "journey_persona_chapter_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journey"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journey" ADD CONSTRAINT "journey_persona_persona_id_persona_id_fk" FOREIGN KEY ("persona_persona_id") REFERENCES "public"."persona"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_persona_fk" FOREIGN KEY ("persona_id") REFERENCES "public"."persona"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_condition_fk" FOREIGN KEY ("condition_id") REFERENCES "public"."condition"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_courses_fk" FOREIGN KEY ("courses_id") REFERENCES "public"."courses"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_practical_guide_fk" FOREIGN KEY ("practical_guide_id") REFERENCES "public"."practical_guide"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_theme_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."theme"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journey_fk" FOREIGN KEY ("journey_id") REFERENCES "public"."journey"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "persona_slug_idx" ON "persona" USING btree ("slug");
  CREATE INDEX "persona_updated_at_idx" ON "persona" USING btree ("updated_at");
  CREATE INDEX "persona_created_at_idx" ON "persona" USING btree ("created_at");
  CREATE UNIQUE INDEX "condition_slug_idx" ON "condition" USING btree ("slug");
  CREATE INDEX "condition_updated_at_idx" ON "condition" USING btree ("updated_at");
  CREATE INDEX "condition_created_at_idx" ON "condition" USING btree ("created_at");
  CREATE INDEX "courses_theme_idx" ON "courses" USING btree ("theme_id");
  CREATE INDEX "courses_persona_idx" ON "courses" USING btree ("persona_id");
  CREATE INDEX "courses_condition_idx" ON "courses" USING btree ("condition_id");
  CREATE INDEX "courses_updated_at_idx" ON "courses" USING btree ("updated_at");
  CREATE INDEX "courses_created_at_idx" ON "courses" USING btree ("created_at");
  CREATE INDEX "practical_guide_condition_idx" ON "practical_guide" USING btree ("condition_id");
  CREATE INDEX "practical_guide_persona_idx" ON "practical_guide" USING btree ("persona_id");
  CREATE INDEX "practical_guide_theme_idx" ON "practical_guide" USING btree ("theme_id");
  CREATE INDEX "practical_guide_practical_guide_idx" ON "practical_guide" USING btree ("practical_guide_id");
  CREATE INDEX "practical_guide_courses_idx" ON "practical_guide" USING btree ("courses_id");
  CREATE INDEX "practical_guide_updated_at_idx" ON "practical_guide" USING btree ("updated_at");
  CREATE INDEX "practical_guide_created_at_idx" ON "practical_guide" USING btree ("created_at");
  CREATE UNIQUE INDEX "theme_slug_idx" ON "theme" USING btree ("slug");
  CREATE INDEX "theme_updated_at_idx" ON "theme" USING btree ("updated_at");
  CREATE INDEX "theme_created_at_idx" ON "theme" USING btree ("created_at");
  CREATE INDEX "journey_persona_chapter_practical_guide_list_order_idx" ON "journey_persona_chapter_practical_guide_list" USING btree ("_order");
  CREATE INDEX "journey_persona_chapter_practical_guide_list_parent_id_idx" ON "journey_persona_chapter_practical_guide_list" USING btree ("_parent_id");
  CREATE INDEX "journey_persona_chapter_practical_guide_list_practical_g_idx" ON "journey_persona_chapter_practical_guide_list" USING btree ("practical_guide_id");
  CREATE INDEX "journey_persona_chapter_order_idx" ON "journey_persona_chapter" USING btree ("_order");
  CREATE INDEX "journey_persona_chapter_parent_id_idx" ON "journey_persona_chapter" USING btree ("_parent_id");
  CREATE INDEX "journey_persona_persona_persona_idx" ON "journey" USING btree ("persona_persona_id");
  CREATE INDEX "journey_updated_at_idx" ON "journey" USING btree ("updated_at");
  CREATE INDEX "journey_created_at_idx" ON "journey" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_persona_id_idx" ON "payload_locked_documents_rels" USING btree ("persona_id");
  CREATE INDEX "payload_locked_documents_rels_condition_id_idx" ON "payload_locked_documents_rels" USING btree ("condition_id");
  CREATE INDEX "payload_locked_documents_rels_courses_id_idx" ON "payload_locked_documents_rels" USING btree ("courses_id");
  CREATE INDEX "payload_locked_documents_rels_practical_guide_id_idx" ON "payload_locked_documents_rels" USING btree ("practical_guide_id");
  CREATE INDEX "payload_locked_documents_rels_theme_id_idx" ON "payload_locked_documents_rels" USING btree ("theme_id");
  CREATE INDEX "payload_locked_documents_rels_journey_id_idx" ON "payload_locked_documents_rels" USING btree ("journey_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "persona" CASCADE;
  DROP TABLE "condition" CASCADE;
  DROP TABLE "courses" CASCADE;
  DROP TABLE "practical_guide" CASCADE;
  DROP TABLE "theme" CASCADE;
  DROP TABLE "journey_persona_chapter_practical_guide_list" CASCADE;
  DROP TABLE "journey_persona_chapter" CASCADE;
  DROP TABLE "journey" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";`);
}
