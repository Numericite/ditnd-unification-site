"use client";

import Link from "next/link";

export default function MapMarkersImportLink() {
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				padding: "0.6rem 1rem",
				marginBottom: "0.75rem",
				background: "var(--theme-elevation-50)",
				border: "1px solid var(--theme-elevation-150)",
				borderRadius: "4px",
				gap: "1rem",
				flexWrap: "wrap",
			}}
		>
			<span
				style={{
					fontSize: "0.875rem",
					color: "var(--theme-elevation-600)",
				}}
			>
				Vous souhaitez ajouter plusieurs points à la fois ?
			</span>
			<Link
				href="/admin/map-import"
				style={{
					display: "inline-flex",
					alignItems: "center",
					padding: "0.4rem 0.9rem",
					background: "var(--theme-elevation-1000)",
					color: "var(--theme-bg)",
					borderRadius: "4px",
					textDecoration: "none",
					fontSize: "0.875rem",
					fontWeight: 500,
					whiteSpace: "nowrap",
				}}
			>
				Importer depuis Excel
			</Link>
		</div>
	);
}
