// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { s3Storage } from "@payloadcms/storage-s3";
import { mediaGalleryPlugin } from "@sitebytom/payload-media-gallery";

import { Users } from "./collections/Users";
import { Personas } from "./collections/Personas";
import { Conditions } from "./collections/Conditions";
import { Courses } from "./collections/Courses";
import { PracticalGuides } from "./collections/PracticalGuides";
import { Themes } from "./collections/Themes";
import { Journeys } from "./collections/Journeys";
import { Medias } from "./collections/Medias";
import { en } from "@payloadcms/translations/languages/en";
import { fr } from "@payloadcms/translations/languages/fr";

import {
	addPracticalGuidesTable,
	addPracticalGuidesTableVector,
} from "./hooks";

const hasAwsCreds = Boolean(
	process.env.S3_ACCESS_KEY_ID &&
		process.env.S3_SECRET_ACCESS_KEY &&
		process.env.S3_BUCKET &&
		process.env.S3_REGION,
);
import { CMSHome } from "./globals/cms/Home";
import { CMSFooter } from "./globals/cms/Footer";
import { PracticalGuideViews } from "./collections/PracticalGuidesViews";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
		livePreview: {
			url: ({ data, collectionConfig }) => {
				if (!data || collectionConfig?.slug !== "practical-guides") return;

				const basePath =
					data._status === "draft"
						? `/draft/${data.slug}`
						: `/guides/${data.slug}`;

				return `${basePath}?v=${data.updatedAt}`;
			},
			breakpoints: [
				{
					label: "Mobile",
					name: "mobile",
					width: 375,
					height: 667,
				},
			],
			collections: ["practical-guides"],
		},
	},
	collections: [
		Users,
		Personas,
		Conditions,
		Courses,
		PracticalGuides,
		PracticalGuideViews,
		Themes,
		Journeys,
		Medias,
	],
	globals: [CMSHome, CMSFooter],
	editor: lexicalEditor(),
	i18n: {
		supportedLanguages: { en, fr },
	},
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: postgresAdapter({
		//beforeSchemaInit: [addPracticalGuidesTable],
		//afterSchemaInit: [addPracticalGuidesTableVector],
		pool: {
			connectionString: process.env.POSTGRESQL_ADDON_URI || "",
		},
	}),
	sharp,
	plugins: [
		s3Storage({
			enabled: hasAwsCreds && process.env.NODE_ENV === "production",
			collections: {
				medias: true,
			},
			bucket: process.env.S3_BUCKET || "",
			config: {
				credentials: {
					accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
					secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
				},
				region: process.env.S3_REGION || "",
			},
		}),
		mediaGalleryPlugin({
			collections: {
				medias: true,
			},
			defaultView: "justified",
			layouts: {
				justified: {
					enabled: true,
					footer: "always",
				},
				masonry: {
					enabled: true,
					footer: "always",
				},
				grid: {
					enabled: true,
					footer: "always",
				},
			},
			lightbox: true,
			edit: true,
			disabled: false,
		}),
	],
});
