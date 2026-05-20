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
		ALTER TABLE "footer" DROP COLUMN IF EXISTS "cgu_title";
		ALTER TABLE "footer" DROP COLUMN IF EXISTS "cgu_content";
		ALTER TABLE "footer" DROP COLUMN IF EXISTS "terms_of_use_title";
		ALTER TABLE "footer" DROP COLUMN IF EXISTS "terms_of_use_content";
	`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
		ALTER TABLE "footer"
			ADD COLUMN "cgu_title" varchar NOT NULL DEFAULT 'Données personnelles';
		ALTER TABLE "footer"
			ADD COLUMN "cgu_content" jsonb NOT NULL DEFAULT ${sql.raw(`'${emptyRichText}'::jsonb`)};
		ALTER TABLE "footer"
			ADD COLUMN "terms_of_use_title" varchar NOT NULL DEFAULT 'Modalités d''utilisation';
		ALTER TABLE "footer"
			ADD COLUMN "terms_of_use_content" jsonb NOT NULL DEFAULT ${sql.raw(`'${emptyRichText}'::jsonb`)};
		ALTER TABLE "footer" ALTER COLUMN "cgu_title" DROP DEFAULT;
		ALTER TABLE "footer" ALTER COLUMN "cgu_content" DROP DEFAULT;
		ALTER TABLE "footer" ALTER COLUMN "terms_of_use_title" DROP DEFAULT;
		ALTER TABLE "footer" ALTER COLUMN "terms_of_use_content" DROP DEFAULT;
	`);
}
