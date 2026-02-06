import type { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useRouter } from "next/router";
import SubMenuCustom from "./SubMenuCustom";
import type { PersonaTile } from "~/components/HomePage/PersonaTiles";
import Button from "@codegouvfr/react-dsfr/Button";
import Header from "@codegouvfr/react-dsfr/Header";
import { personStore } from "~/state/store";

export default function MainNavigation({
	personaPros,
}: {
	personaPros?: PersonaTile[];
}) {
	const router = useRouter();

	const personas = [
		...personStore.get().map((persona) => ({
			...persona,
			name: `Je suis ${persona.name}`,
		})),
		{
			name: "Je suis un professionnel",
			description: "Description type",
			slug: "professional",
			display: "professional" as const,
			pictogram: "CityHall" as const,
		},
	];

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
				text: (
					<SubMenuCustom
						key={persona.slug}
						persona={{ ...persona }}
						personaPros={personaPros || []}
					/>
				),
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

	return (
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
	);
}
