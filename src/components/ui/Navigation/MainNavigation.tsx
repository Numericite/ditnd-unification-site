import type { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useRouter } from "next/router";
import SubMenuCustom from "./SubMenuCustom";
import Button from "@codegouvfr/react-dsfr/Button";
import Header from "@codegouvfr/react-dsfr/Header";
import { personStore } from "~/state/store";
import {
	defaultSkipLinks,
	getPathNameForSkipLinks,
	personsAndProTiles,
	skipLinks,
} from "~/utils/tools";
import SkipLinks from "@codegouvfr/react-dsfr/SkipLinks";

export default function MainNavigation() {
	const router = useRouter();

	const personas = personsAndProTiles(personStore.get());

	const userNavigationItems: MainNavigationProps.Item[] = [
		{
			text: "Accueil",
			isActive: router.pathname === "/",
			linkProps: { href: "/" },
		},
		{
			text: "Je suis",
			isActive: router.pathname.startsWith("/journeys"),
			menuLinks: personas.map((persona) => ({
				text: <SubMenuCustom key={persona.slug} persona={{ ...persona }} />,
				isActive: router.asPath.startsWith(`/journeys/${persona.slug}`),
				linkProps: {
					href: `/journeys/${persona.slug}`,
				},
			})),
		},
		{
			text: "Fiches pratiques",
			linkProps: { href: "/guides" },
			isActive: router.pathname.startsWith("/guides"),
		},
		{
			text: "Formations",
			linkProps: { href: "/formations" },
			isActive: router.pathname.startsWith("/formations"),
		},
		{ text: "Actualités", linkProps: { href: "/actualite" } },
		{ text: "Annuaire", linkProps: { href: "/annuaire" } },
		{
			menuLinks: [
				{
					linkProps: {
						href: "#",
					},
					text: "PH LINK",
				},
			],
			text: "À propos",
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
					title: "Accueil DITND",
				}}
				id="fr-header-with-horizontal-operator-logo"
				navigation={userNavigationItems}
				quickAccessItems={[
					{
						iconId: "fr-icon-add-circle-line",
						linkProps: {
							href: "#",
						},
						text: "Besoin de vérifier une information ?",
					},
					<Button
						key={"button-question"}
						iconId={"fr-icon-message-2-line"}
						priority="secondary"
						size="large"
					>
						Posez votre question
					</Button>,
				]}
				serviceTitle="DI-TND"
				serviceTagline="Délégation interministérielle pour les troubles du neurodéveloppement"
			/>
		</>
	);
}
