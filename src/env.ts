import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		PAYLOAD_SECRET: z
			.string()
			.min(
				32,
				"PAYLOAD_SECRET must be at least 32 characters (use `node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"` to generate)",
			),
		BETTER_AUTH_SECRET: z
			.string()
			.min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
		POSTGRESQL_ADDON_URI: z.string().url(),
		ALBERT_API_KEY: z.string().min(1),
		ALBERT_API_URL: z.string().url(),
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		CONTACT_PROS_CRA_RECIPIENT: z.string().email().optional(),
		CONTACT_PARTICULIERS_RECIPIENT: z.string().email().optional(),
		SMTP_HOST: z.string().optional(),
		SMTP_PORT: z.coerce.number().int().positive().optional(),
		SMTP_USER: z.string().optional(),
		SMTP_PASSWORD: z.string().optional(),
		SMTP_FROM_ADDRESS: z.string().email().optional(),
		SMTP_FROM_NAME: z.string().optional(),
		S3_ACCESS_KEY_ID: z.string().optional(),
		S3_SECRET_ACCESS_KEY: z.string().optional(),
		S3_BUCKET: z.string().optional(),
		S3_REGION: z.string().optional(),
	},
	client: {
		NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
		NEXT_PUBLIC_NOINDEX: z.enum(["true", "false"]).optional(),
	},
	runtimeEnv: {
		PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
		BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
		POSTGRESQL_ADDON_URI: process.env.POSTGRESQL_ADDON_URI,
		ALBERT_API_KEY: process.env.ALBERT_API_KEY,
		ALBERT_API_URL: process.env.ALBERT_API_URL,
		NODE_ENV: process.env.NODE_ENV,
		CONTACT_PROS_CRA_RECIPIENT: process.env.CONTACT_PROS_CRA_RECIPIENT,
		CONTACT_PARTICULIERS_RECIPIENT: process.env.CONTACT_PARTICULIERS_RECIPIENT,
		SMTP_HOST: process.env.SMTP_HOST,
		SMTP_PORT: process.env.SMTP_PORT,
		SMTP_USER: process.env.SMTP_USER,
		SMTP_PASSWORD: process.env.SMTP_PASSWORD,
		SMTP_FROM_ADDRESS: process.env.SMTP_FROM_ADDRESS,
		SMTP_FROM_NAME: process.env.SMTP_FROM_NAME,
		S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
		S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
		S3_BUCKET: process.env.S3_BUCKET,
		S3_REGION: process.env.S3_REGION,
		NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
		NEXT_PUBLIC_NOINDEX: process.env.NEXT_PUBLIC_NOINDEX,
	},
	skipValidation:
		!!process.env.SKIP_ENV_VALIDATION || process.env.NODE_ENV === "test",
	emptyStringAsUndefined: true,
});
