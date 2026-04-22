import type { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useRouter } from "next/router";
import { useState } from "react";
import SubMenuCustom from "./SubMenuCustom";
import Button from "@codegouvfr/react-dsfr/Button";
import Header from "@codegouvfr/react-dsfr/Header";
import { chatbotOpenStore, personStore } from "~/state/store";
import {
	defaultSkipLinks,
	getPathNameForSkipLinks,
	personsAndProTiles,
	skipLinks,
} from "~/utils/tools";
import SkipLinks from "@codegouvfr/react-dsfr/SkipLinks";

export default function MainNavigation() {
	const router = useRouter();
	const [headerSearch, setHeaderSearch] = useState("");

	const personas = personsAndProTiles(personStore.get());

	const userNavigationItems: MainNavigationProps.Item[] = [
		{
			text: "Accueil",
			isActive: router.pathname === "/",
			linkProps: { href: "/" },
		},
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
			],
		},
	];

	const pathName = getPathNameForSkipLinks(router.pathname);

	return (
		<>
			<SkipLinks links={skipLinks[pathName] ?? defaultSkipLinks} />
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
					setHeaderSearch("");
					router.push(`/recherche?search=${encodeURIComponent(trimmed)}`);
				}}
				allowEmptySearch={false}
				clearSearchInputOnSearch
				serviceTitle="Maison de l'autisme"
				serviceTagline="Site national d'informations sur l'autisme et les troubles du neurodéveloppement"
			/>
		</>
	);
}
