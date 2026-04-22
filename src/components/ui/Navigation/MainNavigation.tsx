import type { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SubMenuCustom from "./SubMenuCustom";
import Button from "@codegouvfr/react-dsfr/Button";
import Header from "@codegouvfr/react-dsfr/Header";
import { chatbotOpenStore, personStore } from "~/state/store";
import { personsAndProTiles, skipLinks } from "~/utils/tools";
import SkipLinks from "@codegouvfr/react-dsfr/SkipLinks";

export default function MainNavigation() {
	const router = useRouter();
	const [headerSearch, setHeaderSearch] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);

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
						setHeaderSearch("");
						router.push(`/recherche?search=${encodeURIComponent(trimmed)}`);
					}}
					allowEmptySearch={false}
					clearSearchInputOnSearch
					serviceTitle="Maison de l'autisme"
					serviceTagline="Site national d'informations sur l'autisme et les troubles du neurodéveloppement"
				/>
			</div>
		</>
	);
}
