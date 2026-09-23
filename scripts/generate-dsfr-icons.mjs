import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";

const require = createRequire(import.meta.url);

const iconsDirPath = join(
	dirname(require.resolve("@codegouvfr/react-dsfr/package.json")),
	"dsfr",
	"utility",
	"icons",
);

const projectRoot = new URL("..", import.meta.url).pathname;
const outputPath = join(projectRoot, "src/payload/generated/dsfrIcons.ts");
const previewDirPath = join(projectRoot, "public/dsfr-icons");

const catalog = JSON.parse(
	await readFile(join(iconsDirPath, "icons.json"), "utf8"),
);

const icons = catalog
	.filter((icon) => icon.prefix === "fr-icon-")
	.sort((a, b) => a.iconId.localeCompare(b.iconId));

if (icons.length === 0) {
	throw new Error(`No fr-icon- entry found in ${iconsDirPath}/icons.json`);
}

const contents = `// Généré par scripts/generate-dsfr-icons.mjs — ne pas modifier à la main.
// Les identifiants sont écrits en toutes lettres pour que \`react-dsfr update-icons\`
// les détecte et conserve leurs règles CSS dans le build.

export const DSFR_ICON_IDS = [
${icons.map(({ prefix, iconId }) => `\t"${prefix}${iconId}",`).join("\n")}
] as const;

export type DsfrIconId = (typeof DSFR_ICON_IDS)[number];

const iconIdSet: ReadonlySet<string> = new Set(DSFR_ICON_IDS);

export function isDsfrIconId(value: unknown): value is DsfrIconId {
	return typeof value === "string" && iconIdSet.has(value);
}

/** Aperçu statique servi depuis public/, utilisé par le sélecteur d'icônes de l'admin. */
export function dsfrIconPreviewUrl(iconId: string): string {
	return \`/dsfr-icons/\${iconId.replace(/^fr-icon-/, "")}.svg\`;
}
`;

await writeFile(outputPath, contents, "utf8");

await rm(previewDirPath, { recursive: true, force: true });
await mkdir(previewDirPath, { recursive: true });

await Promise.all(
	icons.map(({ iconId, svgRelativePath }) =>
		copyFile(
			resolve(iconsDirPath, svgRelativePath),
			join(previewDirPath, `${iconId}.svg`),
		),
	),
);

console.log(
	`${icons.length} icônes DSFR écrites dans ${outputPath} et copiées dans ${previewDirPath}`,
);
