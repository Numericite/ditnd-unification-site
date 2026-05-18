import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useMemo, useState } from "react";
import { getPayload } from "payload";
import { tss } from "tss-react/dsfr";
import payloadConfig from "~/payload/payload.config";
import type { Glossary } from "~/payload/payload-types";
import PageContent from "~/components/ui/PageContent";

type Props = {
	terms: Pick<Glossary, "id" | "name" | "description" | "link">[];
};

function normalize(text: string): string {
	return text
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.trim();
}

export default function GlossairePage({ terms }: Props) {
	const { classes, cx } = useStyles();
	const [search, setSearch] = useState("");

	const filteredTerms = useMemo(() => {
		const query = normalize(search);
		if (!query) return terms;
		return terms.filter((term) => {
			const haystack = `${normalize(term.name)} ${normalize(term.description)}`;
			return haystack.includes(query);
		});
	}, [search, terms]);

	return (
		<>
			<Head>
				<title>Glossaire - Maison de l'autisme</title>
				<meta
					name="description"
					content="Glossaire des acronymes et termes utilisés dans le champ de l'autisme et des troubles du neurodéveloppement."
				/>
				<meta property="og:title" content="Glossaire - Maison de l'autisme" />
				<meta
					property="og:description"
					content="Glossaire des acronymes et termes utilisés dans le champ de l'autisme et des troubles du neurodéveloppement."
				/>
				<meta property="og:type" content="article" />
			</Head>
			<div className={fr.cx("fr-container", "fr-pb-8w")}>
				<Breadcrumb
					currentPageLabel="Glossaire"
					homeLinkProps={{ href: "/" }}
					segments={[{ label: "À propos", linkProps: { href: "/a-propos" } }]}
				/>
				<PageContent>
					<h1>Glossaire</h1>
					<p className={fr.cx("fr-text--lead")}>
						Retrouvez les acronymes et termes utilisés dans le champ de
						l'autisme et des troubles du neurodéveloppement.
					</p>

					<div className={fr.cx("fr-grid-row", "fr-mb-4w")}>
						<div className={fr.cx("fr-col-12", "fr-col-md-8")}>
							<SearchBar
								label="Rechercher un terme..."
								big
								onButtonClick={(value) => setSearch(value)}
								renderInput={({ className, id, placeholder, type }) => (
									<input
										className={className}
										id={id}
										placeholder={placeholder}
										type={type}
										value={search}
										onChange={(e) => setSearch(e.currentTarget.value)}
									/>
								)}
							/>
						</div>
					</div>

					<output
						className={cx(fr.cx("fr-text--sm", "fr-mb-2w"), classes.count)}
						aria-live="polite"
					>
						{filteredTerms.length}{" "}
						{filteredTerms.length > 1 ? "termes" : "terme"}
						{search ? ` correspondant à « ${search} »` : ""}
					</output>

					{filteredTerms.length === 0 ? (
						<div className={fr.cx("fr-callout")}>
							<p className={fr.cx("fr-callout__text")}>
								Aucun terme ne correspond à votre recherche.
							</p>
						</div>
					) : (
						<ul className={cx(classes.list)}>
							{filteredTerms.map((term) => (
								<li key={term.id} className={cx(classes.item)}>
									<div className={cx(classes.term)}>
										{term.link ? (
											<a
												href={term.link}
												target="_blank"
												rel="noopener noreferrer"
												className={fr.cx(
													"fr-link",
													"fr-link--icon-right",
													"fr-icon-external-link-line",
												)}
												aria-label={`${term.name} (nouvelle fenêtre)`}
												title={`${term.name} (nouvelle fenêtre)`}
											>
												<strong>{term.name}</strong>
											</a>
										) : (
											<strong>{term.name}</strong>
										)}
									</div>
									<div className={cx(classes.description)}>
										{term.description}
									</div>
								</li>
							))}
						</ul>
					)}
				</PageContent>
			</div>
		</>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const payload = await getPayload({ config: payloadConfig });
	const { docs } = await payload.find({
		collection: "glossary",
		limit: 1000,
		sort: "name",
	});

	const terms = docs.map((doc) => ({
		id: doc.id,
		name: doc.name,
		description: doc.description,
		link: doc.link ?? null,
	}));

	return { props: { terms } };
};

const useStyles = tss.withName(GlossairePage.name).create({
	count: {
		display: "block",
		color: fr.colors.decisions.text.mention.grey.default,
	},
	list: {
		listStyle: "none",
		padding: 0,
		margin: 0,
		display: "grid",
		gap: fr.spacing("2w"),
	},
	item: {
		paddingBottom: fr.spacing("2w"),
		borderBottom: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
	},
	term: {
		marginBottom: fr.spacing("1v"),
		fontSize: "1.125rem",
	},
	description: {
		color: fr.colors.decisions.text.default.grey.default,
	},
});
