// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Personas } from "./collections/Personas";
import { Conditions } from "./collections/Conditions";
import { Courses } from "./collections/Courses";
import { PracticalGuides } from "./collections/PracticalGuides";
import { Themes } from "./collections/Themes";
import { Journeys } from "./collections/Journeys";
import { Medias } from "./collections/Medias";
import { CMSHome } from "./globals/cms/Home";
import { CMSFooter } from "./globals/cms/Footer";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	collections: [
		Users,
		Personas,
		Conditions,
		Courses,
		PracticalGuides,
		Themes,
		Journeys,
		Medias,
	],
	globals: [CMSHome, CMSFooter],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve(dirname, "payload-types.ts"),
	},
	db: postgresAdapter({
		pool: {
			connectionString: process.env.POSTGRESQL_ADDON_URI || "",
		},
	}),
	sharp,
	plugins: [
		// storage-adapter-placeholder
	],
});
