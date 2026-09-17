import { copyFile, mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

// MapLibre v6 ne « inline » plus son worker : il est livré comme un module ESM
// séparé, résolu au runtime via `import.meta.url`. Une fois l'app bundlée,
// `import.meta.url` n'est plus une URL http(s) et MapLibre renvoie une URL de
// worker vide — les tuiles ne se chargent alors jamais. On copie donc le worker
// (et le chunk partagé qu'il importe en relatif) dans /public pour pouvoir le
// désigner explicitement via `setWorkerUrl()` dans MapDisplay.
const FILES = ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"];

const require = createRequire(import.meta.url);
const distDir = dirname(require.resolve("maplibre-gl/dist/maplibre-gl.mjs"));
const outDir = join(process.cwd(), "public", "maplibre");

await mkdir(outDir, { recursive: true });
await Promise.all(
	FILES.map((file) => copyFile(join(distDir, file), join(outDir, file))),
);

console.log(
	`[maplibre] worker copié dans public/maplibre (${FILES.length} fichiers)`,
);
