import { fr } from "@codegouvfr/react-dsfr";
import { SegmentedControl } from "@codegouvfr/react-dsfr/SegmentedControl";
import { useState } from "react";

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

function announcementFor(mode: ContentMode): string {
	return mode === "simplified"
		? "La version simplifiée de la fiche est affichée."
		: "La version standard de la fiche est affichée.";
}

type Props = {
	mode: ContentMode;
	onChange: (mode: ContentMode) => void;
};

export default function ContentModeToggle({ mode, onChange }: Props) {
	// Announcement is empty on first render (avoids reading an unsolicited
	// status on page load) and only filled after a user-initiated change.
	const [announcement, setAnnouncement] = useState("");

	const select = (next: ContentMode) => {
		persistMode(next);
		onChange(next);
		setAnnouncement(announcementFor(next));
	};

	return (
		<>
			<SegmentedControl
				hideLegend
				legend="Choisir la version d'affichage de la fiche"
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
			<output
				className={fr.cx("fr-sr-only")}
				aria-live="polite"
				aria-atomic="true"
			>
				{announcement}
			</output>
		</>
	);
}
