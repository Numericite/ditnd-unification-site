import { fr } from "@codegouvfr/react-dsfr";
import Badge from "@codegouvfr/react-dsfr/Badge";
import Button from "@codegouvfr/react-dsfr/Button";
import Tag from "@codegouvfr/react-dsfr/Tag";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import Image from "next/image";
import { tss } from "tss-react/dsfr";
import ShareSocials from "~/components/ui/CmsPage/ShareSocials";
import WysiwygContent from "~/components/ui/CmsPage/WysiwygContent";
import type { AugmentedCourse } from "~/server/api/routers/courses";

type Props = {
	course: AugmentedCourse;
};

export default function CourseDisplay({ course }: Props) {
	const { classes, cx } = useStyles();

	const banner = course.image?.url ? (
		<Image
			className={cx(fr.cx("fr-responsive-img"), classes.imageBanner)}
			fetchPriority="high"
			priority
			alt=""
			role="presentation"
			src={course.image.url}
			width={1200}
			height={240}
		/>
	) : null;

	const dateLine = (
		<p className={fr.cx("fr-text--sm")}>
			{`Publié le ${new Date(course.createdAt).toLocaleDateString("fr-FR")} - Modifié le ${new Date(course.updatedAt).toLocaleDateString("fr-FR")}`}
		</p>
	);

	const sidebar = (
		<div className={cx(classes.sidebarSticky)}>
			<Button
				iconId="fr-icon-external-link-line"
				iconPosition="right"
				className={cx(classes.fullWidth, fr.cx("fr-mb-3w"))}
				linkProps={{
					href: course.link,
					target: "_blank",
					rel: "noopener noreferrer",
					title: `Accéder à ${course.title}, nouvelle fenêtre`,
					"aria-label": `Accéder à la formation ${course.title}, nouvelle fenêtre`,
				}}
			>
				Accéder à la formation
			</Button>

			<div className={fr.cx("fr-mb-2w")}>
				<Badge noIcon severity="info">
					{course.type}
				</Badge>
			</div>

			<ul className={cx(fr.cx("fr-tags-group"), classes.tagsList)}>
				<li>
					<Tag
						style={{
							color: course.condition.textColor,
							backgroundColor: course.condition.backgroundColor,
						}}
					>
						<strong>{course.condition.slug.toUpperCase()}</strong>
					</Tag>
				</li>
				<li>
					<Tag>
						<strong>{course.theme.name}</strong>
					</Tag>
				</li>
			</ul>
		</div>
	);

	return (
		<div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
			{banner && <div className={fr.cx("fr-col-12")}>{banner}</div>}

			<div className={fr.cx("fr-col-12")}>
				<h1 className={cx(classes.title)}>{course.title}</h1>
				{dateLine}
			</div>

			<div
				className={fr.cx(
					"fr-col-12",
					"fr-col-lg-3",
					"fr-col-md-12",
					"fr-col-sm-12",
					"fr-mb-2w",
				)}
			>
				{sidebar}
			</div>

			<div className={fr.cx("fr-col-12", "fr-col-lg-9")}>
				<p
					className={cx(
						fr.cx("fr-text--lead", "fr-mb-3w"),
						classes.description,
					)}
				>
					{course.description}
				</p>

				{course.content && (
					<WysiwygContent content={course.content as DefaultTypedEditorState} />
				)}

				<div className={cx(classes.footerContent)}>
					<div className={cx(classes.footerInner)}>
						<p className={fr.cx("fr-text--md")}>Partager la page</p>
						<ShareSocials />
					</div>
				</div>
			</div>
		</div>
	);
}

const useStyles = tss.withName(CourseDisplay.name).create(() => ({
	title: {
		color: fr.colors.decisions.text.active.blueFrance.default,
	},
	imageBanner: {
		width: "100%",
		height: "240px",
		objectFit: "cover",
	},
	sidebarSticky: {
		position: "sticky",
		top: "20px",
	},
	fullWidth: {
		width: "100%",
		justifyContent: "center",
	},
	tagsList: {
		paddingInlineStart: "0rem!important",
	},
	description: {
		color: fr.colors.decisions.text.default.grey.default,
	},
	footerContent: {
		borderTop: "2px solid var(--border-default-grey)",
		marginBottom: fr.spacing("3w"),
	},
	footerInner: {
		marginTop: fr.spacing("2w"),
	},
}));
