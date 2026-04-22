import { fr } from "@codegouvfr/react-dsfr";
import { tss } from "tss-react/dsfr";
import Image from "next/image";
import { useState } from "react";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import type { Media } from "~/payload/payload-types";
import type { Link } from "~/utils/tools";
import WysiwygContent from "./WysiwygContent";
import SummaryContent from "./SummaryContent";
import ShareSocials from "./ShareSocials";

type Props = {
	title: string;
	content: DefaultTypedEditorState;
	imageBanner?: Media | null;
};

export default function CmsPageDisplay({ title, content, imageBanner }: Props) {
	const { classes, cx } = useStyles();
	const [links, setMenuLinks] = useState<Link[]>([]);

	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
			{imageBanner?.url && (
				<div className={fr.cx("fr-col-12")}>
					<Image
						className={cx(fr.cx("fr-responsive-img"), classes.imageBanner)}
						fetchPriority="high"
						priority
						alt={imageBanner.alt || title}
						src={imageBanner.url}
						width={1200}
						height={240}
					/>
				</div>
			)}
			<SummaryContent
				menuLinks={links}
				title="Sommaire"
				className={cx(classes.summarySticky)}
			/>
			<div className={fr.cx("fr-col-12", "fr-col-lg-9")}>
				<WysiwygContent
					title={title}
					content={content}
					setMenuLinks={setMenuLinks}
				/>
				<div className={cx(classes.footerContent)}>
					<div className={cx(classes.marginContent)}>
						<p className={fr.cx("fr-text--md")}>Partager la page</p>
						<ShareSocials />
					</div>
				</div>
			</div>
		</div>
	);
}

const useStyles = tss.withName(CmsPageDisplay.name).create(() => ({
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
