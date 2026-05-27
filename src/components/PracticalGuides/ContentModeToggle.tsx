import { fr } from "@codegouvfr/react-dsfr";
import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch";
import { tss } from "tss-react/dsfr";

export type ContentMode = "standard" | "simplified";

export const CONTENT_MODE_COOKIE = "content-mode";

function persistMode(mode: ContentMode) {
	if (typeof document === "undefined") return;
	const maxAge = 60 * 60 * 24 * 365; // 1 year
	const secure =
		typeof window !== "undefined" && window.location.protocol === "https:"
			? "; secure"
			: "";
	document.cookie = `${CONTENT_MODE_COOKIE}=${mode}; path=/; max-age=${maxAge}; samesite=lax${secure}`;
}

type Props = {
	mode: ContentMode;
	onChange: (mode: ContentMode) => void;
};

export default function ContentModeToggle({ mode, onChange }: Props) {
	const { classes } = useStyles();

	return (
		<div className={classes.container}>
			<ToggleSwitch
				label="Version simplifiée"
				helperText="Une version plus simple de la fiche, plus facile à lire."
				checked={mode === "simplified"}
				onChange={(checked) => {
					const next: ContentMode = checked ? "simplified" : "standard";
					persistMode(next);
					onChange(next);
				}}
				labelPosition="left"
			/>
		</div>
	);
}

const useStyles = tss.withName(ContentModeToggle.name).create(() => ({
	container: {
		marginBottom: fr.spacing("2w"),
	},
}));
