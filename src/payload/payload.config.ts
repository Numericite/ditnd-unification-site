// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { s3Storage } from "@payloadcms/storage-s3";
import { searchPlugin } from "@payloadcms/plugin-search";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { beforeSyncPracticalGuide } from "./search";

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
  addCoursesTable,
  addCoursesTableVector,
} from "./hooks";

const hasAwsCreds = Boolean(
  process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY &&
    process.env.S3_BUCKET &&
    process.env.S3_REGION,
);
import { CMSHome } from "./globals/cms/Home";
import { CMSFooter } from "./globals/cms/Footer";
import { CMSAbout } from "./globals/cms/About";
import { PracticalGuideViews } from "./collections/PracticalGuidesViews";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT) || 1025;
const smtpUser = process.env.SMTP_USER;
const smtpPassword = process.env.SMTP_PASSWORD;

export default buildConfig({
  email: nodemailerAdapter({
    defaultFromAddress:
      process.env.SMTP_FROM_ADDRESS || "contact@maisondelautisme.gouv.fr",
    defaultFromName: process.env.SMTP_FROM_NAME || "Maison de l'autisme",
    transportOptions: {
      host: smtpHost || "localhost",
      port: smtpPort,
      secure: smtpPort === 465,
      auth:
        smtpUser && smtpPassword
          ? { user: smtpUser, pass: smtpPassword }
          : undefined,
      ignoreTLS: !smtpUser && !smtpPassword,
    },
  }),
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
            : `/fiches-pratiques/${data.slug}`;

        return `${basePath}?v=${data.updatedAt}`;
      },
      breakpoints: [
        {
          label: "Mobile",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Tablette",
          name: "tablet",
          width: 768,
          height: 1024,
        },
        {
          label: "Bureau",
          name: "desktop",
          width: 1440,
          height: 900,
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
  globals: [CMSHome, CMSFooter, CMSAbout],
  editor: lexicalEditor(),
  i18n: {
    supportedLanguages: { en, fr },
  },
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    extensions: ["vector"],
    beforeSchemaInit: [addPracticalGuidesTable, addCoursesTable],
    afterSchemaInit: [addPracticalGuidesTableVector, addCoursesTableVector],
    pool: {
      connectionString: process.env.POSTGRESQL_ADDON_URI || "",
    },
  }),
  folders: {
    collectionOverrides: [
      ({ collection }) => ({
        ...collection,
        labels: {
          singular: "Dossier",
          plural: "Dossiers",
        },
      }),
    ],
  },
  sharp: (inputFile, options) =>
    sharp(inputFile, { ...options, failOn: "none" }),
  plugins: [
    searchPlugin({
      collections: ["practical-guides"],
      defaultPriorities: {
        "practical-guides": 1,
      },
      beforeSync: beforeSyncPracticalGuide,
      searchOverrides: {
        slug: "search-results",
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: "slug",
            type: "text",
          },
          {
            name: "description",
            type: "textarea",
          },
          {
            name: "contentText",
            type: "textarea",
          },
          {
            name: "conditionNames",
            type: "text",
          },
          {
            name: "themeNames",
            type: "text",
          },
          {
            name: "personaNames",
            type: "text",
          },
        ],
      },
    }),
    seoPlugin({
      collections: ["practical-guides"],
      uploadsCollection: "medias",
      tabbedUI: true,
      generateTitle: ({ doc }) => {
        const title = (doc as Record<string, unknown>)?.title;
        return typeof title === "string"
          ? `${title} - Maison de l'autisme`
          : "Maison de l'autisme";
      },
      generateDescription: ({ doc }) => {
        const description = (doc as Record<string, unknown>)?.description;
        return typeof description === "string" ? description : "";
      },
      generateURL: ({ doc }) => {
        const slug = (doc as Record<string, unknown>)?.slug;
        return typeof slug === "string"
          ? `${process.env.NEXT_PUBLIC_SITE_URL || ""}/fiches-pratiques/${slug}`
          : "";
      },
    }),
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
  ],
});
