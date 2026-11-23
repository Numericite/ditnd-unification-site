// Pages déplacées, redirigées par next.config.js avant tout routage. En JS pour
// être importé par next.config.js ; la validation des slugs les lit aussi, car
// une page ou une rubrique servie sur l'une de ces adresses serait inaccessible.
/** @type {Array<{ source: string; destination: string }>} */
export const PAGE_REDIRECTS = [
	{ source: "/a-propos/cras", destination: "/a-propos/cra" },
	{ source: "/a-propos/glossaire", destination: "/glossaire" },
	{ source: "/gestion-des-cookies", destination: "/donnees-personnelles" },
];
