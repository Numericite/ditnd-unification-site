import { fr } from "@codegouvfr/react-dsfr";
import { useState } from "react";
import { homeCMSStore, tdhStore, type TDH } from "~/state/store";
import { PersonaGrid } from "../ui/HomePage/PersonaGrid";
import { api } from "~/utils/api";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { useRouter } from "next/router";
import { tss } from "tss-react";
import type { PictoProps } from "@codegouvfr/react-dsfr/picto/utils/PictoWrapper";

export type PersonaTypes =
	| "person"
	| "professional"
	| "afterProfessional"
	| "condition"
	| "default";

export type PersonaTile = {
	id?: number;
	name: string;
	description: string;
	slug: string;
	display: PersonaTypes;
	pictogram?: PictoProps;
};

export type TagItem = {
	label: string;
	display: PersonaTypes;
	slug: string;
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
};

export const PersonaTiles = ({
	tiles,
	defaultDisplay,
	defaultTags,
	hideTags = false,
}: Props) => {
	const { classes, cx } = useStyles();

	const [display, setDisplay] = useState<PersonaTypes>(
		defaultDisplay || "default",
	);
	const [tags, setTags] = useState<TagItem[]>(defaultTags || []);
	const [title, setTitle] = useState(titleByDisplay.default);

	const { data: professionalPersonas } = api.persona.professionals.useQuery();

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
			setTitle(titleByDisplay.person);
		},
		professional: (tile) => {
			handleClick(tile, "default");
			setDisplay("professional");
			setTitle(titleByDisplay.professional);
		},
		afterProfessional: (tile) => {
			handleClick(tile, "professional");
			setDisplay("afterProfessional");
			setTitle(titleByDisplay.afterProfessional);
		},
		condition: (tile) => {
			console.log(tags);
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
		setDisplay(tag.display);
		setTitle(titleByDisplay[tag.display]);
		tag.display === "default"
			? setTags([])
			: setTags([...tags].filter((t) => t.slug !== tag.slug));
	}

	const renderContent = () => {
		switch (display) {
			case "person":
				return <PersonaGrid tiles={tdhTiles} onClick={tileDispatchTable} />;

			case "professional":
				if (!professionalPersonas)
					return <div>No professional persona found</div>;

				return (
					<PersonaGrid
						tiles={professionalPersonas}
						onClick={tileDispatchTable}
					/>
				);

			case "afterProfessional":
				return <PersonaGrid tiles={tdh} onClick={tileDispatchTable} />;

			default:
				return (
					<PersonaGrid
						tiles={tiles}
						imageUrl={
							"https://www.systeme-de-design.gouv.fr/v1.14/storybook/img/placeholder.4x3.png"
						}
						onClick={tileDispatchTable}
					/>
				);
		}
	};

	return (
		<>
			<div className={fr.cx("fr-col-12")}>
				<h2>{title}</h2>
				<div className={fr.cx("fr-text--sm")}>{homeCMS.tiles.description}</div>
			</div>
			{!hideTags && (
				<div className={cx(fr.cx("fr-grid-row", "fr-grid-row--gutters"))}>
					{tags.map((tag, index) => (
						<Tag
							key={index}
							className={cx(classes.tagStyles)}
							dismissible
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
		marginBottom: fr.spacing("8v"),
	},
}));
