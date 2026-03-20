import {
  type MigrateUpArgs,
  type MigrateDownArgs,
  sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('medias');
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "practical_guides" ADD COLUMN "meta_title" varchar;
  ALTER TABLE "practical_guides" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "practical_guides" ADD COLUMN "meta_image_id" integer;
  ALTER TABLE "_practical_guides_v" ADD COLUMN "version_meta_title" varchar;
  ALTER TABLE "_practical_guides_v" ADD COLUMN "version_meta_description" varchar;
  ALTER TABLE "_practical_guides_v" ADD COLUMN "version_meta_image_id" integer;
  ALTER TABLE "medias" ADD COLUMN "folder_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "payload_folders_id" integer;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  ALTER TABLE "practical_guides" ADD CONSTRAINT "practical_guides_meta_image_id_medias_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_practical_guides_v" ADD CONSTRAINT "_practical_guides_v_version_meta_image_id_medias_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."medias"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "medias" ADD CONSTRAINT "medias_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "practical_guides_meta_meta_image_idx" ON "practical_guides" USING btree ("meta_image_id");
  CREATE INDEX "_practical_guides_v_version_meta_version_meta_image_idx" ON "_practical_guides_v" USING btree ("version_meta_image_id");
  CREATE INDEX "medias_folder_idx" ON "medias" USING btree ("folder_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload_folders_folder_type" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload_folders" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  ALTER TABLE "practical_guides" DROP CONSTRAINT "practical_guides_meta_image_id_medias_id_fk";
  
  ALTER TABLE "_practical_guides_v" DROP CONSTRAINT "_practical_guides_v_version_meta_image_id_medias_id_fk";
  
  ALTER TABLE "medias" DROP CONSTRAINT "medias_folder_id_payload_folders_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_payload_folders_fk";
  
  DROP INDEX "practical_guides_meta_meta_image_idx";
  DROP INDEX "_practical_guides_v_version_meta_version_meta_image_idx";
  DROP INDEX "medias_folder_idx";
  DROP INDEX "payload_locked_documents_rels_payload_folders_id_idx";
  ALTER TABLE "practical_guides" DROP COLUMN "meta_title";
  ALTER TABLE "practical_guides" DROP COLUMN "meta_description";
  ALTER TABLE "practical_guides" DROP COLUMN "meta_image_id";
  ALTER TABLE "_practical_guides_v" DROP COLUMN "version_meta_title";
  ALTER TABLE "_practical_guides_v" DROP COLUMN "version_meta_description";
  ALTER TABLE "_practical_guides_v" DROP COLUMN "version_meta_image_id";
  ALTER TABLE "medias" DROP COLUMN "folder_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "payload_folders_id";
  DROP TYPE "public"."enum_payload_folders_folder_type";`);
}
