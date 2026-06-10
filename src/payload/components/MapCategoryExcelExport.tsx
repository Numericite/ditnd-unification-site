"use client";

import { useDocumentInfo } from "@payloadcms/ui";

export default function MapCategoryExcelExport() {
	const { id } = useDocumentInfo();

	return (
		<div
			style={{
				marginTop: "1rem",
				paddingTop: "1.25rem",
				borderTop: "1px solid var(--theme-elevation-100)",
			}}
		>
			<p
				style={{
					margin: "0 0 0.25rem 0",
					fontSize: "0.8rem",
					fontWeight: 600,
					textTransform: "uppercase",
					letterSpacing: "0.05em",
					color: "var(--theme-elevation-400)",
				}}
			>
				Modèle d&apos;import
			</p>

			{!id ? (
				<p
					style={{
						margin: "0.5rem 0 0",
						fontSize: "0.875rem",
						color: "var(--theme-elevation-400)",
						fontStyle: "italic",
					}}
				>
					Sauvegardez la catégorie pour télécharger le modèle Excel.
				</p>
			) : (
				<>
					<p
						style={{
							margin: "0.5rem 0 0.875rem",
							fontSize: "0.875rem",
							color: "var(--theme-elevation-600)",
							lineHeight: 1.5,
						}}
					>
						Téléchargez un fichier Excel pré-configuré avec les colonnes, les
						menus déroulants et les validations correspondant à cette catégorie.
						Remplissez-le puis importez-le depuis l&apos;admin.
					</p>
					<a
						href={`/api/map-category-template?categoryId=${id}`}
						style={{
							display: "inline-flex",
							alignItems: "center",
							gap: "0.4rem",
							padding: "0.5rem 1rem",
							background: "var(--theme-elevation-100)",
							border: "1px solid var(--theme-elevation-250)",
							borderRadius: "0.25rem",
							fontSize: "0.875rem",
							color: "var(--theme-text)",
							textDecoration: "none",
							cursor: "pointer",
						}}
					>
						<span aria-hidden>↓</span> Télécharger le modèle Excel
					</a>
				</>
			)}
		</div>
	);
}
