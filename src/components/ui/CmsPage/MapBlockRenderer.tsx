import dynamic from "next/dynamic";
import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";
import { api } from "~/utils/api";

const MapDisplay = dynamic(() => import("./MapDisplay"), {
	ssr: false,
	loading: () => null,
});

type Props = {
	mapId: number;
	height: number;
};

export default function MapBlockRenderer({ mapId, height }: Props) {
	const { classes } = useStyles();
	const { data, isLoading, isError } = api.maps.byId.useQuery({ id: mapId });

	if (isError) {
		return (
			<div className={fr.cx("fr-my-3v", "fr-alert", "fr-alert--warning")}>
				<p>La carte demandée est indisponible.</p>
			</div>
		);
	}

	if (isLoading || !data) {
		return (
			<output
				className={classes.placeholder}
				style={{ height }}
				aria-busy="true"
				aria-label="Chargement de la carte"
			/>
		);
	}

	return <MapDisplay map={data} height={height} />;
}

const useStyles = tss.withName(MapBlockRenderer.name).create(() => ({
	placeholder: {
		width: "100%",
		marginTop: "0.75rem",
		marginBottom: "0.75rem",
		borderRadius: "0.25rem",
		backgroundColor: fr.colors.decisions.background.alt.grey.default,
		border: `1px solid ${fr.colors.decisions.border.default.grey.default}`,
	},
}));
