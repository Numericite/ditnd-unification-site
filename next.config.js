import { withPayload } from "@payloadcms/next/withPayload";
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const config = {
	reactStrictMode: true,
	webpack: (config) => {
		config.module.rules.push({
			test: /\.woff2$/,
			type: "asset/resource",
		});
		return config;
	},
	transpilePackages: ["@codegouvfr/react-dsfr", "tss-react"],
	i18n: {
		locales: ["fr"],
		defaultLocale: "fr",
	},
	experimental: {
		serverActions: {
			bodySizeLimit: "50mb",
		},
	},
	async rewrites() {
		// Médias hérités de l'ancien site WordPress : les URLs /app/uploads/*
		// (backlinkées depuis l'extérieur, notamment ~200 PDF) sont servies depuis
		// le préfixe legacy/ du bucket S3 — voir docs/plan-redirections-seo.md
		return [
			{
				source: "/app/uploads/:path*",
				destination: `https://${process.env.S3_BUCKET || "ditnd-unification"}.s3.${process.env.S3_REGION || "eu-west-3"}.amazonaws.com/legacy/app/uploads/:path*`,
			},
		];
	},
	async headers() {
		if (process.env.NEXT_PUBLIC_NOINDEX !== "true") return [];
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-Robots-Tag",
						value: "noindex, nofollow, noarchive",
					},
				],
			},
		];
	},
};

export default withPayload(config, { devBundleServerPackages: false });
