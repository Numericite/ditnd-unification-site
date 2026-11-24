import type { MainNavigationProps } from "@codegouvfr/react-dsfr/MainNavigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import SubMenuCustom from "./SubMenuCustom";
import Button from "@codegouvfr/react-dsfr/Button";
import Header from "@codegouvfr/react-dsfr/Header";
import {
	chatbotOpenStore,
	contactPathStore,
	lockedMenuStore,
	menuStore,
	personStore,
} from "~/state/store";
import { type LockedMenuItem, type NavLink, isPathActive } from "~/utils/menu";
import { personsAndProTiles } from "~/utils/pictograms";
import { skipLinks } from "~/utils/tools";
import SkipLinks from "@codegouvfr/react-dsfr/SkipLinks";
import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";
import useStickyHeaderOffset from "./useStickyHeaderOffset";

export default function MainNavigation() {
	const { classes, cx } = useStyles();
	const router = useRouter();
	const initialHeaderSearch =
		typeof router.query.search === "string" ? router.query.search : "";
	const [headerSearch, setHeaderSearch] = useState(initialHeaderSearch);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);
	const alertRef = useRef<HTMLDivElement>(null);

	useStickyHeaderOffset(headerRef, alertRef);

	useEffect(() => {
		const search =
			typeof router.query.search === "string" ? router.query.search : "";
		setHeaderSearch(search);
	}, [router.query.search]);

	const personas = personsAndProTiles(personStore.get());
	const currentPath = router.asPath;
	const toNavigationLink = (link: NavLink) => ({
		text: link.title,
		isActive: !link.external && isPathActive(currentPath, link.href),
		linkProps: link.external
			? {
					href: link.href,
					target: "_blank",
					rel: "noopener noreferrer",
					title: `${link.title}, nouvelle fenêtre`,
				}
			: { href: link.href },
	});

	const lockedSubmenus: Record<
		NonNullable<LockedMenuItem["submenu"]>,
		() => MainNavigationProps.Item.Link[]
	> = {
		personas: () =>
			personas.map((persona) => ({
				text: <SubMenuCustom key={persona.slug} persona={{ ...persona }} />,
				isActive: isPathActive(currentPath, `/parcours/${persona.slug}`),
				linkProps: { href: `/parcours/${persona.slug}` },
			})),
	};

	const isHome = isPathActive(currentPath, "/");

	const userNavigationItems: MainNavigationProps.Item[] = [
		{
			text: (
				<>
					<span
						className={cx(fr.cx("ri-home-line"), classes.homeIcon)}
						aria-hidden="true"
					/>
					<span className={classes.homeLabel}>Accueil</span>
				</>
			),
			isActive: isHome,
			linkProps: { href: "/", title: "Accueil" },
		},
		...lockedMenuStore.get().map((item): MainNavigationProps.Item => {
			const isActive = item.activePaths.some((path) =>
				isPathActive(currentPath, path),
			);
			return item.submenu
				? {
						text: item.title,
						isActive,
						menuLinks: lockedSubmenus[item.submenu](),
					}
				: { text: item.title, isActive, linkProps: { href: item.href } };
		}),
		...menuStore.get().map((item): MainNavigationProps.Item => {
			if ("children" in item) {
				const menuLinks = item.children.map(toNavigationLink);
				return {
					text: item.title,
					isActive: menuLinks.some((link) => link.isActive),
					menuLinks,
				};
			}
			return toNavigationLink(item);
		}),
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
			<div ref={alertRef} className={cx(classes.mainAlert, fr.cx("fr-p-2v"))}>
				<span
					className={cx("ri-phone-line", classes.icon)}
					aria-hidden="true"
				/>
				Ligne nationale d'écoute :{" "}
				<a href="tel:+33800714040" className={classes.alertLink}>
					0 800 71 40 40
				</a>{" "}
				<span className={classes.mention}>— appel gratuit</span>
				<span aria-hidden="true" className={classes.separator}>
					·
				</span>
				<a href={contactPathStore.get()} className={classes.alertLink}>
					Écrire au service
				</a>
			</div>
			<div id="menu" ref={headerRef} className={cx(classes.stickyHeader)}>
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
					operatorLogo={{
						orientation: "horizontal",
						imgUrl: "/tnd-logo.png",
						alt: "Site national d'informations sur l'autisme et ses troubles associés",
					}}
					classes={{
						brandTop: classes.brandTop,
						operator: classes.operatorLogo,
					}}
					id="fr-header-with-horizontal-operator-logo"
					navigation={userNavigationItems}
					quickAccessItems={[
						<Button
							key={"button-contact"}
							iconId={"fr-icon-mail-line"}
							priority="secondary"
							size="large"
							linkProps={{ href: contactPathStore.get() }}
						>
							Contactez-nous
						</Button>,
					]}
					renderSearchInput={({ className, id, type }) => (
						<input
							ref={searchInputRef}
							className={className}
							id={id}
							placeholder="Rechercher sur tout le site"
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
				/>
			</div>
		</>
	);
}

const useStyles = tss.withName({ MainNavigation }).create({
	homeIcon: {
		[fr.breakpoints.down("lg")]: { marginRight: fr.spacing("1w") },
	},
	homeLabel: {
		[fr.breakpoints.up("lg")]: {
			position: "absolute",
			width: 1,
			height: 1,
			padding: 0,
			margin: -1,
			overflow: "hidden",
			clip: "rect(0, 0, 0, 0)",
			whiteSpace: "nowrap",
			border: 0,
		},
	},
	stickyHeader: {
		// Pinned so that only the navigation bar stays visible under the banner:
		// the DSFR header body scrolls away behind it.
		[fr.breakpoints.up("lg")]: {
			position: "sticky",
			top: "calc(var(--sticky-alert-height, 0px) - var(--sticky-header-hidden-height, 0px))",
			zIndex: 750,
		},
	},
	brandTop: {
		[fr.breakpoints.up("lg")]: { flexShrink: 0 },
	},
	operatorLogo: {
		"& img": {
			maxWidth: "11.25rem !important",
		},
		[fr.breakpoints.up("lg")]: {
			flexShrink: 0,
			"& img": { width: "11.25rem" },
		},
	},
	mainAlert: {
		...fr.typography[18].style,
		marginBottom: 0,
		[fr.breakpoints.up("lg")]: {
			position: "sticky",
			top: 0,
			zIndex: 751,
		},
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
	alertLink: {
		color: "inherit",
	},
	separator: {
		margin: `0 ${fr.spacing("1w")}`,
	},
	mention: {
		color: fr.colors.decisions.text.mention.grey.default,
		[fr.breakpoints.down("md")]: {
			display: "none",
		},
	},
});
