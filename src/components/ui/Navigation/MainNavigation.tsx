import type { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SubMenuCustom from "./SubMenuCustom";
import Button from "@codegouvfr/react-dsfr/Button";
import Header from "@codegouvfr/react-dsfr/Header";
import { chatbotOpenStore, personStore } from "~/state/store";
import { personsAndProTiles } from "~/utils/pictograms";
import { skipLinks } from "~/utils/tools";
import SkipLinks from "@codegouvfr/react-dsfr/SkipLinks";
import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";

export default function MainNavigation() {
	const { classes, cx } = useStyles();
	const router = useRouter();
	const initialHeaderSearch =
		typeof router.query.search === "string" ? router.query.search : "";
	const [headerSearch, setHeaderSearch] = useState(initialHeaderSearch);
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const search =
			typeof router.query.search === "string" ? router.query.search : "";
		setHeaderSearch(search);
	}, [router.query.search]);

	const personas = personsAndProTiles(personStore.get());

	const userNavigationItems: MainNavigationProps.Item[] = [
		{
			text: "Je suis",
			isActive: router.pathname.startsWith("/parcours"),
			menuLinks: personas.map((persona) => ({
				text: <SubMenuCustom key={persona.slug} persona={{ ...persona }} />,
				isActive: router.asPath.startsWith(`/parcours/${persona.slug}`),
				linkProps: {
					href: `/parcours/${persona.slug}`,
				},
			})),
		},
		{
			text: "Fiches pratiques",
			linkProps: { href: "/fiches-pratiques" },
			isActive: router.pathname.startsWith("/fiches-pratiques"),
		},
		{
			text: "Formations",
			linkProps: { href: "/formations" },
			isActive: router.pathname.startsWith("/formations"),
		},
		{
			text: "Cartographie",
			linkProps: { href: "/cartographie" },
			isActive: router.pathname.startsWith("/cartographie"),
		},
		{
			text: "Annuaire",
			linkProps: {
				href: "https://annuaire.autismeinfoservice.fr/",
				target: "_blank",
			},
		},
		{
			text: "À propos",
			isActive: router.pathname.startsWith("/a-propos"),
			menuLinks: [
				{
					text: "Maison de l'autisme",
					isActive: router.pathname === "/a-propos/maison-de-l-autisme",
					linkProps: { href: "/a-propos/maison-de-l-autisme" },
				},
				{
					text: "GNCRA",
					isActive: router.pathname === "/a-propos/gncra",
					linkProps: { href: "/a-propos/gncra" },
				},
				{
					text: "CRAs",
					isActive: router.pathname === "/a-propos/cras",
					linkProps: { href: "/a-propos/cras" },
				},
				{
					text: "Glossaire",
					isActive: router.pathname === "/a-propos/glossaire",
					linkProps: { href: "/a-propos/glossaire" },
				},
			],
		},
	];

	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement | null;
			if (target?.closest('a[href="#chatbot"]')) {
				e.preventDefault();
				chatbotOpenStore.set(true);
				return;
			}
			if (target?.closest('a[href="#search-global"]')) {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};
		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, []);

	return (
		<>
			<SkipLinks links={skipLinks} />
			<div className={cx(classes.mainAlert, fr.cx("fr-p-2v"))}>
				<span
					className={cx("ri-phone-line", classes.icon)}
					aria-hidden="true"
				/>
				Ligne nationale d'écoute autisme :{" "}
				<a href="tel:+33800714040" className={classes.phoneLink}>
					0 800 71 40 40
				</a>{" "}
				<span className={classes.mention}>— appel gratuit et anonyme</span>
			</div>
			<div id="menu">
				<Header
					brandTop={
						<>
							RÉPUBLIQUE
							<br />
							FRANÇAISE
						</>
					}
					homeLinkProps={{
						href: "/",
						title: "Accueil - Maison de l'autisme",
					}}
					id="fr-header-with-horizontal-operator-logo"
					navigation={userNavigationItems}
					quickAccessItems={[
						<Button
							key={"button-question"}
							iconId={"fr-icon-message-3-line"}
							priority="secondary"
							size="large"
							onClick={() => chatbotOpenStore.set(true)}
						>
							Posez votre question
						</Button>,
					]}
					renderSearchInput={({ className, id, placeholder, type }) => (
						<input
							ref={searchInputRef}
							className={className}
							id={id}
							placeholder={placeholder}
							type={type}
							value={headerSearch}
							onChange={(e) => setHeaderSearch(e.currentTarget.value)}
						/>
					)}
					onSearchButtonClick={(text) => {
						const trimmed = text.trim();
						if (!trimmed) return;
						router.push(`/recherche?search=${encodeURIComponent(trimmed)}`);
					}}
					allowEmptySearch={false}
					serviceTitle="Maison de l'autisme"
					serviceTagline="Site national d'informations sur l'autisme et les troubles du neurodéveloppement"
				/>
			</div>
		</>
	);
}

const useStyles = tss.withName(MainNavigation.name).create({
	mainAlert: {
		...fr.typography[18].style,
		marginBottom: 0,
		backgroundColor: fr.colors.decisions.background.alt.blueFrance.default,
		color: fr.colors.decisions.background.flat.blueFrance.default,
		textAlign: "center",
		[fr.breakpoints.down("md")]: {
			...fr.typography[17].style,
			marginBottom: 0,
		},
	},
	icon: {
		marginRight: fr.spacing("1v"),
		"&::before": {
			"--icon-size": "1.125rem",
		},
	},
	phoneLink: {
		color: "inherit",
	},
	mention: {
		color: fr.colors.decisions.text.mention.grey.default,
		[fr.breakpoints.down("md")]: {
			display: "none",
		},
	},
});
