"use client";

import { useField } from "@payloadcms/ui";

function extractYouTubeId(url: string): string | null {
	try {
		const parsed = new URL(url);
		if (parsed.hostname === "youtu.be") {
			return parsed.pathname.split("/")[1] || null;
		}
		if (parsed.searchParams.get("v")) {
			return parsed.searchParams.get("v");
		}
		return null;
	} catch {
		return null;
	}
}

export default function YouTubeEmbed() {
	const { value: url } = useField<string>({ path: "url" });
	const { value: sizeUnit } = useField<string>({ path: "sizeUnit" });
	const { value: sizeValue } = useField<number>({ path: "sizeValue" });

	const videoId = url ? extractYouTubeId(url) : null;

	const unit = sizeUnit || "percent";
	const value = sizeValue ?? 100;
	const width = unit === "percent" ? `${value}%` : `${value}px`;

	if (!videoId) {
		return (
			<div
				style={{
					padding: "2rem",
					textAlign: "center",
					background: "#f5f5f5",
					borderRadius: "4px",
					color: "#666",
				}}
			>
				Entrez une URL YouTube valide pour voir l&apos;aperçu
			</div>
		);
	}

	return (
		<div
			style={{
				width,
				maxWidth: "100%",
				margin: "1rem 0",
			}}
		>
			<iframe
				style={{
					width: "100%",
					aspectRatio: "16 / 9",
					border: 0,
					borderRadius: "4px",
				}}
				src={`https://www.youtube-nocookie.com/embed/${videoId}`}
				title="YouTube video player"
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	);
}
