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
};

export default withPayload(config, { devBundleServerPackages: false });
