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
	headerToolbar?: ReactNode;
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
	headerToolbar,
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
			alt=""
			role="presentation"
			src={imageBanner.url}
			width={1200}
			height={240}
		/>
	) : null;

	const dateLine =
		createdAt && updatedAt ? (
			<p
				className={fr.cx("fr-text--sm")}
			>{`Publié le ${new Date(createdAt).toLocaleDateString("fr-FR")} - Modifié le ${new Date(updatedAt).toLocaleDateString("fr-FR")}`}</p>
		) : null;

	const heading = (
		<>
			<h1 className={cx(classes.title)}>{title}</h1>
			{dateLine}
		</>
	);

	const body = (
		<>
			<WysiwygContent content={content} />
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

	const toolbar = headerToolbar ? (
		<div className={cx(fr.cx("fr-col-12"), classes.headerToolbar)}>
			{headerToolbar}
		</div>
	) : null;

	if (!hasSummary) {
		return (
			<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
				{banner && <div className={fr.cx("fr-col-12")}>{banner}</div>}
				<div
					className={fr.cx("fr-col-12", "fr-col-lg-8", "fr-col-offset-lg-2")}
				>
					{heading}
				</div>
				{toolbar}
				<div
					className={fr.cx("fr-col-12", "fr-col-lg-8", "fr-col-offset-lg-2")}
				>
					{body}
				</div>
			</div>
		);
	}

	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
			{banner && <div className={fr.cx("fr-col-12")}>{banner}</div>}
			<div className={fr.cx("fr-col-12")}>{heading}</div>
			{toolbar}
			<SummaryContent
				menuLinks={links}
				title="Sommaire"
				className={cx(classes.summarySticky)}
			/>
			<div className={fr.cx("fr-col-12", "fr-col-lg-9")}>{body}</div>
		</div>
	);
}

const useStyles = tss.withName(CmsPageLayout.name).create(() => ({
	title: {
		color: fr.colors.decisions.text.active.blueFrance.default,
	},
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
	headerToolbar: {
		position: "sticky",
		top: 0,
		zIndex: 10,
		display: "flex",
		justifyContent: "flex-end",
		background: fr.colors.decisions.background.default.grey.default,
		paddingTop: fr.spacing("1w"),
		paddingBottom: fr.spacing("1w"),
	},
}));
