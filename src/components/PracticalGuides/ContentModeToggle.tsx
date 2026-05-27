import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";

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
	const select = (next: ContentMode) => {
		persistMode(next);
		onChange(next);
	};

	return (
		<SegmentedControl
			hideLegend
			legend="Affichage de la fiche"
			segments={[
				{
					label: "Version standard",
					nativeInputProps: {
						checked: mode === "standard",
						onChange: () => select("standard"),
					},
				},
				{
					label: "Version simplifiée",
					nativeInputProps: {
						checked: mode === "simplified",
						onChange: () => select("simplified"),
					},
				},
			]}
		/>
	);
}
