import {
	type MigrateUpArgs,
	type MigrateDownArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
		CREATE TYPE "public"."enum_practical_guides_simplified_generation_status"
			AS ENUM('pending', 'ready', 'failed');
		CREATE TYPE "public"."enum__practical_guides_v_version_simplified_generation_status"
			AS ENUM('pending', 'ready', 'failed');

		ALTER TABLE "practical_guides"
			ADD COLUMN "content_simplified" jsonb;
		ALTER TABLE "practical_guides"
			ADD COLUMN "simplified_generation_status" "public"."enum_practical_guides_simplified_generation_status";
		ALTER TABLE "practical_guides"
			ADD COLUMN "simplified_generated_at" timestamp(3) with time zone;

		ALTER TABLE "_practical_guides_v"
			ADD COLUMN "version_content_simplified" jsonb;
		ALTER TABLE "_practical_guides_v"
			ADD COLUMN "version_simplified_generation_status" "public"."enum__practical_guides_v_version_simplified_generation_status";
		ALTER TABLE "_practical_guides_v"
			ADD COLUMN "version_simplified_generated_at" timestamp(3) with time zone;
	`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
		ALTER TABLE "_practical_guides_v" DROP COLUMN IF EXISTS "version_simplified_generated_at";
		ALTER TABLE "_practical_guides_v" DROP COLUMN IF EXISTS "version_simplified_generation_status";
		ALTER TABLE "_practical_guides_v" DROP COLUMN IF EXISTS "version_content_simplified";

		ALTER TABLE "practical_guides" DROP COLUMN IF EXISTS "simplified_generated_at";
		ALTER TABLE "practical_guides" DROP COLUMN IF EXISTS "simplified_generation_status";
		ALTER TABLE "practical_guides" DROP COLUMN IF EXISTS "content_simplified";

		DROP TYPE IF EXISTS "public"."enum__practical_guides_v_version_simplified_generation_status";
		DROP TYPE IF EXISTS "public"."enum_practical_guides_simplified_generation_status";
	`);
}
