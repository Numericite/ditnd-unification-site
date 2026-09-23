import { fr } from "@codegouvfr/react-dsfr";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import SearchBar from "@codegouvfr/react-dsfr/SearchBar";
import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { getPayload } from "payload";
import { tss } from "tss-react/dsfr";
import payloadConfig from "~/payload/payload.config";
import type { Glossary } from "~/payload/payload-types";
import AlphabetNav from "~/components/ui/Glossary/AlphabetNav";
import PageContent from "~/components/ui/PageContent";

type Term = Pick<Glossary, "id" | "name" | "description" | "link">;

type Props = {
	terms: Term[];
};

const OTHER_LETTER = "#";

function normalize(text: string): string {
	return text
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.trim();
}

function getInitial(name: string): string {
	const letter = normalize(name).charAt(0).toUpperCase();
	return /[A-Z]/.test(letter) ? letter : OTHER_LETTER;
}

export default function GlossairePage({ terms }: Props) {
	const { classes, cx } = useStyles();
	const router = useRouter();
	const [search, setSearch] = useState("");

	const activeLetter = useMemo(() => {
		const raw = router.query.lettre;
		const value = Array.isArray(raw) ? raw[0] : raw;
		if (!value) return null;
		const letter = value.toUpperCase();
		return /^[A-Z]$/.test(letter) || letter === OTHER_LETTER ? letter : null;
	}, [router.query.lettre]);

	const availableLetters = useMemo(
		() => new Set(terms.map((term) => getInitial(term.name))),
		[terms],
	);

	const filteredTerms = useMemo(() => {
		if (search) {
			const query = normalize(search);
			return terms.filter((term) =>
				`${normalize(term.name)} ${normalize(term.description)}`.includes(
					query,
				),
			);
		}
		if (activeLetter) {
			return terms.filter((term) => getInitial(term.name) === activeLetter);
		}
		return terms;
	}, [search, activeLetter, terms]);

	const groups = useMemo(() => {
		const map = new Map<string, Term[]>();
		for (const term of filteredTerms) {
			const initial = getInitial(term.name);
			const group = map.get(initial);
			if (group) group.push(term);
			else map.set(initial, [term]);
		}
		return [...map.entries()].sort(([a], [b]) => a.localeCompare(b, "fr"));
	}, [filteredTerms]);

	const buildHref = (letter: string | null) =>
		letter
			? `/a-propos/glossaire?lettre=${letter.toLowerCase()}`
			: "/a-propos/glossaire";

	const setLetter = (letter: string | null, replace = false) => {
		const href = buildHref(letter);
		const options = { shallow: true, scroll: false };
		if (replace) router.replace(href, undefined, options);
		else router.push(href, undefined, options);
	};

	const handleSelectLetter = (letter: string | null) => {
		setSearch("");
		setLetter(letter);
	};

	const handleSearchChange = (value: string) => {
		setSearch(value);
		if (value && activeLetter) setLetter(null, true);
	};

	const countLabel = `${filteredTerms.length} ${filteredTerms.length > 1 ? "termes" : "terme"}`;
	const filterLabel = search
		? ` correspondant à « ${search} »`
		: activeLetter
			? activeLetter === OTHER_LETTER
				? " ne commençant pas par une lettre"
				: ` commençant par la lettre ${activeLetter}`
			: "";

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

					<div className={fr.cx("fr-grid-row", "fr-mb-3w")}>
						<div className={fr.cx("fr-col-12", "fr-col-md-8")}>
							<SearchBar
								label="Rechercher un terme..."
								big
								onButtonClick={(value) => handleSearchChange(value)}
								renderInput={({ className, id, placeholder, type }) => (
									<input
										className={className}
										id={id}
										placeholder={placeholder}
										type={type}
										value={search}
										onChange={(e) => handleSearchChange(e.currentTarget.value)}
									/>
								)}
							/>
						</div>
					</div>

					<AlphabetNav
						availableLetters={availableLetters}
						activeLetter={search ? null : activeLetter}
						buildHref={buildHref}
						onSelect={handleSelectLetter}
					/>

					<output
						className={cx(fr.cx("fr-text--sm", "fr-mb-2w"), classes.count)}
						aria-live="polite"
					>
						{countLabel}
						{filterLabel}
					</output>

					{groups.length === 0 ? (
						<div className={fr.cx("fr-callout")}>
							<p className={fr.cx("fr-callout__text")}>
								Aucun terme ne correspond à votre recherche.
							</p>
						</div>
					) : (
						groups.map(([letter, groupTerms]) => (
							<section key={letter} className={cx(classes.group)}>
								<h2
									id={`lettre-${letter.toLowerCase()}`}
									className={cx(classes.groupTitle)}
								>
									{letter === OTHER_LETTER ? "Autres" : letter}
								</h2>
								<ul className={cx(classes.list)}>
									{groupTerms.map((term) => (
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
							</section>
						))
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
	group: {
		marginBottom: fr.spacing("4w"),
	},
	groupTitle: {
		marginBottom: fr.spacing("2w"),
		paddingBottom: fr.spacing("1w"),
		borderBottom: `2px solid ${fr.colors.decisions.border.actionHigh.blueFrance.default}`,
		color: fr.colors.decisions.text.actionHigh.blueFrance.default,
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
