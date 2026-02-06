import { fr } from "@codegouvfr/react-dsfr";
import { useState } from "react";
import { homeCMSStore, proStore, tdhStore, type TDH } from "~/state/store";
import { PersonaGrid } from "../ui/HomePage/PersonaGrid";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { useRouter } from "next/router";
import { tss } from "tss-react";
import type { Persona } from "~/payload/payload-types";
import type { PictogramName } from "~/utils/tools";
import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";

export type PersonaTypes =
	| "person"
	| "professional"
	| "afterProfessional"
	| "condition"
	| "default";

export interface PersonaTile
	extends Omit<Persona, "updatedAt" | "createdAt" | "id"> {
	display: PersonaTypes;
	pictogram?: PictogramName | null;
}

export type TagItem = {
	label: string;
	display: PersonaTypes;
	slug: string;
	dismissible?: boolean;
};

const unknownTile: TDH = {
	name: "Un trouble que je ne sais pas identifier",
	description: "Diagnostic rapide de vos symptômes pour mieux vous comprendre",
	acronym: "unknown",
	slug: "unknown",
	display: "condition",
};

const titleByDisplay: Record<PersonaTypes, string> = {
	default: "Qui êtes vous?",
	person: "Sur quel trouble voulez-vous vous informer ?",
	professional: "Quel type de professionnel êtes-vous ?",
	afterProfessional: "Sur quel trouble voulez-vous vous informer ?",
	condition: "",
};

type Props = {
	tiles: PersonaTile[];
	defaultDisplay?: PersonaTypes;
	defaultTags?: TagItem[];
	hideTags?: boolean;
	unique?: boolean;
};

export const PersonaTiles = ({
	tiles,
	defaultDisplay,
	defaultTags,
	hideTags = false,
	unique = false,
}: Props) => {
	const { classes, cx } = useStyles();

	const [display, setDisplay] = useState<PersonaTypes>(
		defaultDisplay || "default",
	);
	const [tags, setTags] = useState<TagItem[]>(defaultTags || []);
	const [subTitle, setSubTitle] = useState(
		titleByDisplay[defaultDisplay || "default"],
	);

	const professionalPersonas = proStore.get();

	const router = useRouter();

	const tdh = tdhStore.get();
	const homeCMS = homeCMSStore.get();

	const tdhTiles = [unknownTile, ...tdh];

	const handleClick = (tile: PersonaTile, prevDisplay: PersonaTypes) => {
		setTags((prev) => [
			...prev,
			{
				label: tile.name,
				slug: tile.slug,
				display: prevDisplay,
			},
		]);
	};

	const tileDispatchTable: Record<PersonaTypes, (tile: PersonaTile) => void> = {
		person: (tile) => {
			handleClick(tile, "default");
			setDisplay("person");
			setSubTitle(titleByDisplay.person);
		},
		professional: (tile) => {
			handleClick(tile, "default");
			setDisplay("professional");
			setSubTitle(titleByDisplay.professional);
		},
		afterProfessional: (tile) => {
			handleClick(tile, "professional");
			setDisplay("afterProfessional");
			setSubTitle(titleByDisplay.afterProfessional);
		},
		condition: (tile) => {
			const personaSlug = tags
				.filter((tag) => tag.slug !== "professional")
				.map((tag) => tag.slug);
			router.push(`/journeys/${personaSlug}/${tile.slug}`);
		},
		default: () => {
			setDisplay("default");
		},
	};

	function deleteTag(tag: TagItem) {
		const isDismissible = tag.dismissible ?? true;
		if (isDismissible) {
			setDisplay(tag.display);
			setSubTitle(titleByDisplay[tag.display]);
			tag.display === "default"
				? setTags([])
				: setTags([...tags].filter((t) => t.slug !== tag.slug));
		}
	}

	function navigateBreadcrumb(tag: TagItem) {
		setTags((prev) => {
			const index = prev.findIndex((t) => t.slug === tag.slug);
			if (index === -1) return prev;
			return prev.slice(0, index + 1);
		});

		setDisplay(tag.display);
		setSubTitle(titleByDisplay[tag.display]);
	}

	const renderContent = () => {
		switch (display) {
			case "person":
				return <PersonaGrid tiles={tdhTiles} onClick={tileDispatchTable} />;

			case "professional":
				if (!professionalPersonas)
					return <div>Aucun persona professionnel trouvé</div>;

				return (
					<PersonaGrid
						tiles={professionalPersonas}
						onClick={tileDispatchTable}
					/>
				);

			case "afterProfessional":
				return <PersonaGrid tiles={tdh} onClick={tileDispatchTable} />;

			default:
				return <PersonaGrid tiles={tiles} onClick={tileDispatchTable} />;
		}
	};

	return (
		<>
			{unique && (
				<Breadcrumb
					className={cx(classes.customBreadcrumb)}
					currentPageLabel={tags.at(-1)?.label}
					homeLinkProps={{
						href: "/",
					}}
					segments={
						tags.at(-1)?.slug.startsWith("pro")
							? tags.slice(0, -1).map((tag) => ({
									label: tag.label,
									linkProps: {
										href: `/journeys/professional`,
										onClick: () => navigateBreadcrumb(tag),
									},
								}))
							: []
					}
				/>
			)}

			<div className={fr.cx("fr-col-12")}>
				{unique && (
					<h1 className={cx(classes.coloredTitle)}>
						{tags.at(-1)?.slug === "professional"
							? undefined
							: tags.at(-1)?.label}
					</h1>
				)}
				<h2>{subTitle}</h2>
				<div className={fr.cx("fr-text--sm")}>{homeCMS.tiles.description}</div>
			</div>

			{!hideTags && (
				<div className={cx(fr.cx("fr-grid-row", "fr-grid-row--gutters"))}>
					{tags.map((tag, index) => (
						<Tag
							key={index}
							className={cx(classes.tagStyles)}
							dismissible={tag.dismissible ?? true}
							nativeButtonProps={{
								onClick: () => deleteTag(tag),
							}}
						>
							{tag.label}
						</Tag>
					))}
				</div>
			)}

			<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
				{renderContent()}
			</div>
		</>
	);
};

const useStyles = tss.withName(PersonaTiles.name).create(() => ({
	tagStyles: {
		marginLeft: fr.spacing("3v"),
		marginBottom: fr.spacing("3v"),
	},
	coloredTitle: {
		color: fr.colors.decisions.artwork.major.blueFrance.default,
	},
	customBreadcrumb: {
		paddingTop: fr.spacing("2w"),
		marginBottom: fr.spacing("2v"),
		marginTop: "0",
	},
}));
