import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Drawer from "@mui/material/Drawer";
import { tss } from "tss-react/dsfr";
import MultiSelect from "~/components/ui/MultiSelect";

export type FilterOption = {
	code: string;
	label: string;
};

export type CategoryOption = {
	id: number;
	name: string;
};

export type ActiveFilters = {
	regions: string[];
	departements: string[];
	categories: number[];
};

type Props = {
	isOpen: boolean;
	onClose: () => void;
	availableRegions: FilterOption[];
	availableDepartements: FilterOption[];
	availableCategories: CategoryOption[];
	activeFilters: ActiveFilters;
	onRegionsChange: (codes: string[]) => void;
	onDepartementsChange: (codes: string[]) => void;
	onCategoriesChange: (ids: number[]) => void;
	onReset: () => void;
	totalActive: number;
};

export default function MapFilterDrawer({
	isOpen,
	onClose,
	availableRegions,
	availableDepartements,
	availableCategories,
	activeFilters,
	onRegionsChange,
	onDepartementsChange,
	onCategoriesChange,
	onReset,
	totalActive,
}: Props) {
	const { classes, cx } = useStyles();

	return (
		<Drawer
			anchor="right"
			open={isOpen}
			onClose={onClose}
			aria-label="Filtres"
			slotProps={{
				paper: {
					sx: {
						width: "min(400px, 100vw)",
						display: "flex",
						flexDirection: "column",
						backgroundColor:
							fr.colors.decisions.background.default.grey.default,
						boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15)",
					},
				},
			}}
		>
			<div className={classes.drawerHeader}>
				<h2 className={classes.drawerTitle}>Filtres</h2>
				<button
					type="button"
					className={cx(
						fr.cx("fr-btn", "fr-btn--tertiary-no-outline", "fr-btn--sm"),
						classes.closeBtn,
					)}
					onClick={onClose}
					aria-label="Fermer le panneau des filtres"
				>
					<span className={fr.cx("fr-icon-close-line")} aria-hidden="true" />
				</button>
			</div>

			<div className={classes.drawerBody}>
				<Button
					priority="tertiary"
					size="small"
					onClick={onReset}
					disabled={totalActive <= 0}
				>
					Réinitialiser ({totalActive})
				</Button>

				{availableCategories.length > 1 ? (
					<MultiSelect
						id="filter-categories"
						label="Catégorie"
						options={availableCategories.map((c) => ({
							value: String(c.id),
							label: c.name,
						}))}
						selectedValues={activeFilters.categories.map(String)}
						onChange={(values) => onCategoriesChange(values.map(Number))}
					/>
				) : null}

				{availableRegions.length > 0 ? (
					<MultiSelect
						id="filter-regions"
						label="Région"
						options={availableRegions.map((r) => ({
							value: r.code,
							label: r.label,
						}))}
						selectedValues={activeFilters.regions}
						onChange={onRegionsChange}
					/>
				) : null}

				{availableDepartements.length > 0 ? (
					<MultiSelect
						id="filter-departements"
						label="Département"
						options={availableDepartements.map((d) => ({
							value: d.code,
							label: d.label,
						}))}
						selectedValues={activeFilters.departements}
						onChange={onDepartementsChange}
					/>
				) : null}
			</div>
		</Drawer>
	);
}

const useStyles = tss.withName("MapFilterDrawer").create(() => ({
	drawerHeader: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "1rem 1.25rem",
		borderBottom: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
		position: "sticky",
		top: 0,
		backgroundColor: fr.colors.decisions.background.default.grey.default,
		zIndex: 1,
	},
	drawerTitle: {
		margin: 0,
		fontSize: "1.125rem",
		fontWeight: 700,
		color: fr.colors.decisions.text.title.grey.default,
	},
	closeBtn: {
		flexShrink: 0,
	},

	drawerBody: {
		flex: 1,
		padding: "1rem 1.25rem",
		display: "flex",
		flexDirection: "column",
		gap: "1.5rem",
		overflowY: "auto",
	},
}));
