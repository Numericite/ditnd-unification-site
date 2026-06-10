import { fr } from "@codegouvfr/react-dsfr";
import type { TagProps } from "@codegouvfr/react-dsfr/Tag";
import TagsGroup from "@codegouvfr/react-dsfr/TagsGroup";
import { tss } from "tss-react/dsfr";
import type { AllowedCustomFieldFilter } from "~/server/api/routers/maps";
import type {
	ActiveFilters,
	CategoryOption,
	FilterOption,
} from "./MapFilterDrawer";

type TagEntry = { id: string; label: string; onRemove: () => void };

function toTagItem(tag: TagEntry): TagProps {
	return {
		children: tag.label,
		dismissible: true,
		nativeButtonProps: {
			onClick: tag.onRemove,
			"aria-label": `Supprimer le filtre : ${tag.label}`,
		},
	};
}

type Props = {
	activeFilters: ActiveFilters;
	availableRegions: FilterOption[];
	availableDepartements: FilterOption[];
	availableCategories: CategoryOption[];
	allowedCustomFieldFilters: AllowedCustomFieldFilter[];
	onRegionsChange: (codes: string[]) => void;
	onDepartementsChange: (codes: string[]) => void;
	onCategoriesChange: (ids: number[]) => void;
	onCustomFieldChange: (key: string, values: string[]) => void;
};

export default function ActiveFilterTags({
	activeFilters,
	availableRegions,
	availableDepartements,
	availableCategories,
	allowedCustomFieldFilters,
	onRegionsChange,
	onDepartementsChange,
	onCategoriesChange,
	onCustomFieldChange,
}: Props) {
	const { classes } = useStyles();
	const tags: TagEntry[] = [];

	for (const id of activeFilters.categories) {
		const cat = availableCategories.find((c) => c.id === id);
		tags.push({
			id: `cat-${id}`,
			label: cat?.name ?? String(id),
			onRemove: () =>
				onCategoriesChange(activeFilters.categories.filter((c) => c !== id)),
		});
	}

	for (const code of activeFilters.regions) {
		const region = availableRegions.find((r) => r.code === code);
		tags.push({
			id: `reg-${code}`,
			label: region?.label ?? code,
			onRemove: () =>
				onRegionsChange(activeFilters.regions.filter((c) => c !== code)),
		});
	}

	for (const code of activeFilters.departements) {
		const dept = availableDepartements.find((d) => d.code === code);
		tags.push({
			id: `dept-${code}`,
			label: dept?.label ?? code,
			onRemove: () =>
				onDepartementsChange(
					activeFilters.departements.filter((c) => c !== code),
				),
		});
	}

	for (const [filterKey, values] of Object.entries(
		activeFilters.customFields,
	)) {
		const fieldDef = allowedCustomFieldFilters.find(
			(f) => `${f.categoryId}::${f.key}` === filterKey,
		);
		for (const value of values) {
			let valueLabel = value;
			if (fieldDef?.fieldType === "checkbox") {
				valueLabel = value === "true" ? "Oui" : "Non";
			} else if (fieldDef?.fieldType === "select") {
				const opt = fieldDef.options?.find((o) => o.value === value);
				valueLabel = opt?.label ?? value;
			}
			const label = fieldDef ? `${fieldDef.label} : ${valueLabel}` : valueLabel;
			tags.push({
				id: `cf-${filterKey}-${value}`,
				label,
				onRemove: () =>
					onCustomFieldChange(
						filterKey,
						values.filter((v) => v !== value),
					),
			});
		}
	}

	if (tags.length === 0) return null;

	return (
		<TagsGroup
			className={classes.tagsGroup}
			smallTags
			tags={tags.map(toTagItem) as [TagProps, ...TagProps[]]}
		/>
	);
}

const useStyles = tss.withName("ActiveFilterTags").create(() => ({
	tagsGroup: {
		paddingLeft: "0 !important",
		marginBottom: `${fr.spacing("2v")} !important`,
		"& > li": {
			lineHeight: "normal",
		},
		"& .fr-tag": {
			marginBottom: fr.spacing("2v"),
		},
	},
}));
