import { fr } from "@codegouvfr/react-dsfr";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import Image from "next/image";
import { type ReactNode, useMemo } from "react";
import { tss } from "tss-react/dsfr";
import type { Media } from "~/payload/payload-types";
import { type Link, generateSummaryFromRichText } from "~/utils/tools";
import ShareSocials from "./ShareSocials";
import SummaryContent from "./SummaryContent";
import WysiwygContent from "./WysiwygContent";

type Props = {
	title: string;
	content: DefaultTypedEditorState;
	imageBanner?: Media | null;
	createdAt?: string;
	updatedAt?: string;
	showShareSocials?: boolean;
	extraLinks?: Link[];
	children?: ReactNode;
};

export default function CmsPageLayout({
	title,
	content,
	imageBanner,
	createdAt,
	updatedAt,
	showShareSocials = false,
	extraLinks,
	children,
}: Props) {
	const { classes, cx } = useStyles();

	const links = useMemo(() => {
		const base = generateSummaryFromRichText(content);
		return extraLinks ? [...base, ...extraLinks] : base;
	}, [content, extraLinks]);

	const hasSummary = links.length > 0;

	const banner = imageBanner?.url ? (
		<Image
			className={cx(fr.cx("fr-responsive-img"), classes.imageBanner)}
			fetchPriority="high"
			priority
			alt={imageBanner.alt || title}
			src={imageBanner.url}
			width={1200}
			height={240}
		/>
	) : null;

	const main = (
		<>
			<WysiwygContent
				title={title}
				content={content}
				createdAt={createdAt}
				updatedAt={updatedAt}
			/>
			{showShareSocials && (
				<div className={cx(classes.footerContent)}>
					<div className={cx(classes.marginContent)}>
						<p className={fr.cx("fr-text--md")}>Partager la page</p>
						<ShareSocials />
					</div>
				</div>
			)}
			{children}
		</>
	);

	if (!hasSummary) {
		return (
			<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
				{banner && <div className={fr.cx("fr-col-12")}>{banner}</div>}
				<div
					className={fr.cx("fr-col-12", "fr-col-lg-8", "fr-col-offset-lg-2")}
				>
					{main}
				</div>
			</div>
		);
	}

	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
			{banner && <div className={fr.cx("fr-col-12")}>{banner}</div>}
			<SummaryContent
				menuLinks={links}
				title="Sommaire"
				className={cx(classes.summarySticky)}
			/>
			<div className={fr.cx("fr-col-12", "fr-col-lg-9")}>{main}</div>
		</div>
	);
}

const useStyles = tss.withName(CmsPageLayout.name).create(() => ({
	footerContent: {
		borderTop: "2px solid var(--border-default-grey)",
		marginBottom: fr.spacing("3w"),
	},
	marginContent: {
		marginTop: fr.spacing("2w"),
	},
	imageBanner: {
		width: "100%",
		height: "240px",
		objectFit: "cover",
	},
	summarySticky: {
		position: "sticky",
		top: "20px",
		".fr-summary__link:before": {
			visibility: "hidden",
		},
	},
}));
