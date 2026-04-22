import {
	type MigrateUpArgs,
	type MigrateDownArgs,
	sql,
} from "@payloadcms/db-postgres";

const emptyRichText = JSON.stringify({
	root: {
		type: "root",
		format: "",
		indent: 0,
		version: 1,
		children: [
			{
				type: "paragraph",
				format: "",
				indent: 0,
				version: 1,
				children: [],
				direction: null,
				textStyle: "",
				textFormat: 0,
			},
		],
		direction: null,
	},
});

export async function up({ db }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
		ALTER TABLE "footer"
			ADD COLUMN "contact_pros_cra_title" varchar NOT NULL DEFAULT 'Formulaire de contact réservé aux professionnels des CRA';
		ALTER TABLE "footer"
			ADD COLUMN "contact_pros_cra_image_banner_id" integer;
		ALTER TABLE "footer"
			ADD COLUMN "contact_pros_cra_content" jsonb NOT NULL DEFAULT ${sql.raw(`'${emptyRichText}'::jsonb`)};
		ALTER TABLE "footer"
			ALTER COLUMN "contact_pros_cra_title" DROP DEFAULT;
		ALTER TABLE "footer"
			ALTER COLUMN "contact_pros_cra_content" DROP DEFAULT;
		ALTER TABLE "footer"
			ADD CONSTRAINT "footer_contact_pros_cra_image_banner_id_medias_id_fk"
			FOREIGN KEY ("contact_pros_cra_image_banner_id")
			REFERENCES "public"."medias"("id")
			ON DELETE set null ON UPDATE no action;
		CREATE INDEX "footer_contact_pros_cra_contact_pros_cra_image_bann_idx"
			ON "footer" USING btree ("contact_pros_cra_image_banner_id");
	`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
		DROP INDEX IF EXISTS "footer_contact_pros_cra_contact_pros_cra_image_bann_idx";
		ALTER TABLE "footer"
			DROP CONSTRAINT IF EXISTS "footer_contact_pros_cra_image_banner_id_medias_id_fk";
		ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_pros_cra_content";
		ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_pros_cra_image_banner_id";
		ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_pros_cra_title";
	`);
}
