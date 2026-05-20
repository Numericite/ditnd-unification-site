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
			ADD COLUMN "contact_particuliers_title" varchar NOT NULL DEFAULT 'Adressez-nous vos questions sur l''autisme et les TND';
		ALTER TABLE "footer"
			ADD COLUMN "contact_particuliers_image_banner_id" integer;
		ALTER TABLE "footer"
			ADD COLUMN "contact_particuliers_content" jsonb NOT NULL DEFAULT ${sql.raw(`'${emptyRichText}'::jsonb`)};
		ALTER TABLE "footer"
			ALTER COLUMN "contact_particuliers_title" DROP DEFAULT;
		ALTER TABLE "footer"
			ALTER COLUMN "contact_particuliers_content" DROP DEFAULT;
		ALTER TABLE "footer"
			ADD CONSTRAINT "footer_contact_particuliers_image_banner_id_medias_id_fk"
			FOREIGN KEY ("contact_particuliers_image_banner_id")
			REFERENCES "public"."medias"("id")
			ON DELETE set null ON UPDATE no action;
		CREATE INDEX "footer_contact_particuliers_contact_particuliers_image_idx"
			ON "footer" USING btree ("contact_particuliers_image_banner_id");
	`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
		DROP INDEX IF EXISTS "footer_contact_particuliers_contact_particuliers_image_idx";
		ALTER TABLE "footer"
			DROP CONSTRAINT IF EXISTS "footer_contact_particuliers_image_banner_id_medias_id_fk";
		ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_particuliers_content";
		ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_particuliers_image_banner_id";
		ALTER TABLE "footer" DROP COLUMN IF EXISTS "contact_particuliers_title";
	`);
}
