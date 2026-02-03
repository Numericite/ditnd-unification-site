import { fr } from "@codegouvfr/react-dsfr";
import type { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useRouter } from "next/router";
import { useState } from "react";
import { tss } from "tss-react";
import SubMenuCustom from "./SubMenuCustom";
import type { PersonaTile } from "~/components/HomePage/PersonaTiles";
import Button from "@codegouvfr/react-dsfr/Button";
import Header from "@codegouvfr/react-dsfr/Header";
import { personStore } from "~/state/store";

function isRouteActive(item: MainNavigationProps.Item, path: string) {
	const href = item.linkProps?.href;

	if (!href) return false;

	if (href === "/guides") return path.startsWith("/guides");

	if (href === "/formations") return path.startsWith("/formations");

	return path === href;
}

export default function MainNavigation({
	personaPros,
}: {
	personaPros?: PersonaTile[];
}) {
	const { classes } = useStyles();

	const router = useRouter();

	const [currentSubMenuPersona, setCurrentSubMenuPersona] = useState<
		string | null
	>(null);

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
		{ text: "Accueil", linkProps: { href: "/" } },
		{
			text: "Je suis",
			className: classes.megaMenuCustom,
			buttonProps: {
				onClick: () => setCurrentSubMenuPersona(null),
			},
			menuLinks: personas.map((persona) => ({
				text: (
					<SubMenuCustom
						key={persona.slug}
						persona={{ ...persona }}
						personaPros={personaPros || []}
						isActive={currentSubMenuPersona === persona.slug}
					/>
				),
				linkProps: {
					href: `/journeys/${persona.slug}`,
					style: {
						backgroundColor:
							currentSubMenuPersona === persona.slug
								? fr.colors.decisions.background.contrast.grey.default
								: "inherit",
					},
					onClick:
						persona.slug === "professional"
							? (e) => {
									e.preventDefault();
									console.log(persona.slug);
									setCurrentSubMenuPersona(
										currentSubMenuPersona !== persona.slug
											? persona.slug
											: null,
									);
								}
							: undefined,
					onKeyDownCapture:
						persona.slug === "professional"
							? (e) => {
									e.preventDefault();
									console.log(persona.slug);
									setCurrentSubMenuPersona(
										currentSubMenuPersona !== persona.slug
											? persona.slug
											: null,
									);
								}
							: undefined,
				},
			})),
		},
		{ text: "Fiches pratiques", linkProps: { href: "/guides" } },
		{
			text: "Formations",
			linkProps: { href: "/formations" },
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

	const navigationItems = userNavigationItems.map((item) => ({
		...item,
		isActive: isRouteActive(item, router.asPath),
	}));

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
			navigation={navigationItems}
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

const useStyles = tss.withName(MainNavigation.name).create({
	megaMenuCustom: {
		".fr-menu__list": {
			position: "relative",
		},
		".fr-collapse": {
			overflow: "visible",
			"&:is(.fr-collapsing)": {
				overflow: "hidden",
			},
		},
	},
});
